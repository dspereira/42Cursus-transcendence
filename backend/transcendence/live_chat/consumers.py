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
			self.room = await sync_to_async(room_model.get)(id=self.scope["room_id"])
		if not self.user or not self.room:
			await self.close(4000)
			return

		self.username = self.user.username
		self.room_group_name = str(self.room.id)

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

		chat_messages = await sync_to_async(self.__getRoomMessages)()
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'chat_empty_status',
				'messages': chat_messages,
			}
		)

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
		message = data_json['message'].strip()
		if message:
			result_message = f"{self.username}: {message}"
			await sync_to_async(msg_model.create)(user=self.user, room=self.room, content=message)
			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'chat_message',
					'message': result_message,
				}
			)

	async def chat_message(self, event):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		await self.send(text_data=json.dumps({
			'type': 'chat_message',
			'message': event['message'],
		}))

	async def chat_empty_status(self, event):
		await self.send(text_data=json.dumps({
			'type': 'chat_empty_status',
			'messages': event['messages'],
		}))

	def __getRoomMessages(self):
		chat_messages = ""
		messages = msg_model.filter(room=self.room)
		if messages:
			for msg in messages:
				result_message = f"{msg.user.username}: {msg.content}"
				chat_messages += result_message + "\n"
		return chat_messages
