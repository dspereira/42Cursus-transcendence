import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from user_auth.models import User

from custom_utils.jwt_utils import JwtData

from .models import ChatRoom, Message

from channels.exceptions import StopConsumer

from .auth_utils import is_authenticated, get_authenticated_user


class ChatConsumer(WebsocketConsumer):

	def __init__(self, *args, **kwargs):
		super().__init__(args, kwargs)
		self.user = None
		self.access_data = None
		

	def connect(self):

		self.accept()		
		self.access_data = self.scope['access_data']
		if is_authenticated(self.access_data):
			self.user = get_authenticated_user(self.access_data.sub)
		if not self.user:
			self.close(4000)
			return
		
		self.username = self.user.username
		self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
		self.room = ChatRoom.objects.get(id=self.room_id)
		print(f"WebSocket connected")
		print("Session User:", self.user)
		print("Session User:", self.room_id)

		self.room_group_name = self.room_id

		async_to_sync(self.channel_layer.group_add)(
			self.room_group_name,
			self.channel_name
		)

		chat_messages = ""
		empty_status = False
		messages = Message.objects.filter(room=self.room)

		if messages:
			for msg in messages:
				result_message = f"{msg.user.username}: {msg.content}"
				chat_messages += result_message + "\n"
		else:
			empty_status = True

		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'chat_empty_status',
				'empty': empty_status,
				'messages': chat_messages,
			}
		)

		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'online_offline_messages',
				'status': 'online',
				'message': f"{self.username} is now online",
			}
		)

	def disconnect(self, close_code):
		print(f"WebSocket disconnected")
		print("Close code -> ", close_code)

		'''
		self.close(code=close_code)
		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'online_offline_messages',
				'status': 'offline',
				'message': f"{self.username} is now offline",
			}
		)

		async_to_sync(self.channel_layer.group_discard)(
			self.room_group_name,
			self.channel_name
		)
		'''
		raise StopConsumer()

	def receive(self, text_data):
		data_json = json.loads(text_data)
		message = data_json['message'].strip()

		if message:
			result_message = f"{self.username}: {message}"

			Message.objects.create(user=self.user, room=self.room, content=message)

			print(result_message)

			async_to_sync(self.channel_layer.group_send)(
				self.room_group_name,
				{
					'type': 'chat_message',
					'message': result_message,
				}
			)

	def chat_message(self, event):

		#print("-------chat_message----------")
		#print(self.scope['access_data'])


		#if not is_authenticated(self.__getAccessTokenTest()):
		#	self.disconnect(4000)
  
		if not is_authenticated(self.access_data):
			self.close(4000)
			return

		message = event['message']
		self.send(text_data=json.dumps({
			'type': 'chat_message',
			'message': message,
		}))

	def chat_empty_status(self, event):
		self.send(text_data=json.dumps({
			'type': 'chat_empty_status',
			'empty': event['empty'],
			'messages': event['messages'],
		}))

	def online_offline_messages(self, event):
		message = event['message']
		status = event['status']
		self.send(text_data=json.dumps({
			'type': 'online_offline_messages',
			'status': status,
			'message': message,
		}))
		print(message)


