import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import ChatRoom, Message
from channels.exceptions import StopConsumer
from .auth_utils import is_authenticated, get_authenticated_user
from custom_utils.models_utils import ModelManager

msg_model = ModelManager(Message)
room_model = ModelManager(ChatRoom)

class ChatConsumer(AsyncWebsocketConsumer):

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.user = None
		self.room = None
		self.access_data = None
		self.room_group_name = None

	async def connect(self):
		await self.accept()
		self.access_data = self.scope['access_data']
		if await sync_to_async(is_authenticated)(self.access_data):
			self.user = await sync_to_async(get_authenticated_user)(self.access_data.sub)
		if not self.user:
			await self.close(4000)
			return

	async def disconnect(self, close_code):
		print(" Close code -> ", close_code)
		if self.room_group_name:
			await self.channel_layer.group_discard(
				self.room_group_name,
				self.channel_name
			)
		raise StopConsumer()

	async def receive(self, text_data):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		data_json = json.loads(text_data)
		data_type = data_json['type']
		if data_type == "connect":
			await self.__disconnect_previous_chatroom()
			await self.__connect_to_friend_chatroom(data_json['friend_id'])
		elif data_type == "message":
			await self.__send_message(data_json['message'].strip())

	async def __connect_to_friend_chatroom(self, friends_id):
		self.room = await self.__get_room(friends_id=friends_id)
		if self.room:
			self.room_group_name = self.room.name
			await self.channel_layer.group_add(
				self.room_group_name,
				self.channel_name
			)

	async def __disconnect_previous_chatroom(self):
		if self.room_group_name:
			await self.channel_layer.group_discard(
				self.room_group_name,
				self.channel_name
			)

	async def __send_message(self, message):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		await sync_to_async(msg_model.create)(user=self.user, room=self.room, content=message)
		if self.room_group_name:
			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'send_message_to_friend',
					'message': message,
					'id': self.user.id,
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
		}))

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
