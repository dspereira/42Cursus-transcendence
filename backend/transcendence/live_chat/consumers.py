import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom, Message
from user_auth.models import User
from user_profile.models import UserProfileInfo
from user_profile.aux import get_image_url
from channels.exceptions import StopConsumer
from .auth_utils import is_authenticated, get_authenticated_user
from custom_utils.models_utils import ModelManager
from datetime import datetime

from friendships.friendships import get_friendship
from friendships.friendships import get_friend_list
from friendships.friendships import get_friends_users_list

msg_model = ModelManager(Message)
room_model = ModelManager(ChatRoom)
user_model = ModelManager(User)
user_profile_model = ModelManager(UserProfileInfo)

MESSAGE_LIMIT_COUNT = 5

class ChatConsumer(AsyncWebsocketConsumer):

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.user = None
		self.room = None
		self.access_data = None
		self.room_group_name = None
		self.groups = []

	async def connect(self):
		await self.accept()
		self.access_data = self.scope['access_data']
		if await sync_to_async(is_authenticated)(self.access_data):
			self.user = await sync_to_async(get_authenticated_user)(self.access_data.sub)
		if not self.user:
			await self.close(4000)
			return
		self.user_profile = await sync_to_async(user_profile_model.get)(user=self.user)
		await self.__connect_to_friends()
		await self.__update_online_status(is_online=True)

	async def disconnect(self, close_code):
		await self.__update_online_status(is_online=False)
		for group in self.groups:
			await self.channel_layer.group_discard(group, self.channel_name)
		self.groups = []
		raise StopConsumer()

	async def receive(self, text_data):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		data_json = json.loads(text_data)
		data_type = data_json['type']
		if data_type == "connect":
			await self.__connect_to_friend_chatroom(data_json['friend_id'])
		elif data_type == "get_messages":
			await self.__send_chat_group_messages(amount_messages=data_json['message_count'], id_browser=data_json['idBrowser'])
		elif data_type == "message":
			if not await self.__get_block_status(friend_id=data_json['friend_id']):
				new_message = await self.__save_message(data_json['message'].strip())
				await self.__send_message(new_message)

	async def __connect_to_friend_chatroom(self, friends_id):
		self.room = await self.__get_room(friends_id=friends_id)
		self.friendship = await self.__get_friendship(friends_id=friends_id)

		if self.room:
			self.room_group_name = self.room.name
			if self.room_group_name not in self.groups:
				self.groups.append(self.room_group_name)
				await self.channel_layer.group_add(
					self.room_group_name,
					self.channel_name
				)

	async def __save_message(self, message):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		new_message = await sync_to_async(msg_model.create)(user=self.user, room=self.room, content=message)
		return new_message

	async def __send_message(self, message):
		message_content = message.content
		user_id = await sync_to_async(lambda: message.user.id)()
		timestamp = int(datetime.fromisoformat(str(message.timestamp)).timestamp())
		await self.__update_last_chat_interaction(last_chat_timestamp=message.timestamp)
		if self.room_group_name:
			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'send_message_to_friend',
					'message': message_content,
					'id': user_id,
					'timestamp': timestamp,
					'user_image': await self.__get_user_image(user_id=user_id)
				}
			)

	async def send_message_to_friend(self, event):
		if self.user.id == event['id']:
			owner = "owner"
		else:
			owner = "friend"
		await self.send(text_data=json.dumps({
			'type': 'message',
			'message': event['message'],
			'owner': owner,
			'timestamp': event['timestamp'],
			'user_image': event['user_image'],
		}))

	async def __send_get_message(self, message, id_browser):
		message_content = message.content
		user_id = await sync_to_async(lambda: message.user.id)()
		timestamp = int(datetime.fromisoformat(str(message.timestamp)).timestamp())
		if self.room_group_name:
			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'send_requested_message',
					'message': message_content,
					'id': user_id,
					'timestamp': timestamp,
					'requester_id': self.user.id,
					'idBrowser': id_browser,
					'user_image': await self.__get_user_image(user_id=user_id)
				}
			)

	async def send_requested_message(self, event):
		if self.user.id == event['id']:
			owner = "owner"
		else:
			owner = "friend"
		await self.send(text_data=json.dumps({
			'type': 'get_message',
			'message': event['message'],
			'owner': owner,
			'timestamp': event['timestamp'],
			'requester_id': event['requester_id'],
			'idBrowser': event['idBrowser'],
			'user_image': event['user_image'],
		}))

	def __get_messages(self, start, limit):
		return list(msg_model.filter(room=self.room)[start:start+limit])

	def __get_count_messages(self):
		filter_msgs = msg_model.filter(room=self.room)
		if filter_msgs:
			return filter_msgs.count()
		return 0

	async def __send_chat_group_messages(self, amount_messages, id_browser):
		message_count = await sync_to_async(self.__get_count_messages)()
		if message_count > amount_messages and message_count > 0:

			if message_count - amount_messages < MESSAGE_LIMIT_COUNT:
				message_start = 0
				message_limit = message_count - amount_messages
			else:
				message_limit = MESSAGE_LIMIT_COUNT
				message_start = message_count - message_limit - amount_messages

			all_chat_group_messages = await sync_to_async(self.__get_messages)(message_start, message_limit)
			all_chat_group_messages.reverse()
			for message in all_chat_group_messages:
				await self.__send_get_message(message=message, id_browser=id_browser)

	async def __get_room(self, friends_id):
		room_name_1 = f'{self.user.id}_{friends_id}'
		room_name_2 = f'{friends_id}_{self.user.id}'

		room_1 = await sync_to_async(room_model.get)(name=room_name_1)
		if room_1:
			return room_1
		room_2 = await sync_to_async(room_model.get)(name=room_name_2)
		if room_2:
			return room_2
		return None

	async def __get_friendship(self, friends_id):
		friend = await sync_to_async(user_model.get)(id=friends_id)
		if friend:
			return await sync_to_async(get_friendship)(user1=self.user, user2=friend)

	async def __update_last_chat_interaction(self, last_chat_timestamp):
		self.friendship.last_chat_interaction = last_chat_timestamp
		await sync_to_async(self.friendship.save)()	

	async def __get_block_status(self, friend_id):
		self.friendship = await self.__get_friendship(friends_id=friend_id)
		if self.friendship.user1_block or self.friendship.user2_block:
			return True
		return False

	async def __update_online_status(self, is_online):
		online = False

		if is_online:
			self.user_profile.online += 1
		else:
			self.user_profile.online -= 1
		await sync_to_async(self.user_profile.save)()

		if self.user_profile.online:
			online = True

		for group_name in self.groups:
			await self.channel_layer.group_send(
					group_name,
					{'type': 'send_online_status', 'id': self.user.id, 'online': online}
				)

	async def send_online_status(self, event):
		await self.send(text_data=json.dumps({
			'type': 'online_status',
			'user_id': event['id'],
			'online': event['online']
		}))

	async def __get_user_image(self, user_id):
		user = await sync_to_async(user_model.get)(id=user_id)
		if user:
			user_profile = await sync_to_async(user_profile_model.get)(user=user)
			return await sync_to_async(get_image_url)(user=user_profile)

	async def __connect_to_friends(self):
		friend_list = await sync_to_async(get_friend_list)(user=self.user)
		friends_users_list = await sync_to_async(get_friends_users_list)(friends=friend_list, user_id=self.user.id)
		for friend in friends_users_list:
			room = await self.__get_room(friends_id=friend['id'])
			room_name = room.name
			await self.channel_layer.group_add(room_name, self.channel_name)
			if room_name not in self.groups:
				self.groups.append(room_name)
