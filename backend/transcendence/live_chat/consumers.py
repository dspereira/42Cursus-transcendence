import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from user_auth.models import User

from custom_utils.jwt_utils import JwtData

from .models import ChatRoom, Message

from channels.exceptions import StopConsumer

class ChatConsumer(WebsocketConsumer):

	def __init__(self, *args, **kwargs):
		super().__init__(args, kwargs)

	def connect(self):
		self.accept()

		self.user = self.__getUser()
		if not self.user:
			self.close()

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

		# self.close()
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
		raise StopConsumer()

	def receive(self, text_data):
		data_json = json.loads(text_data)
		message = data_json['message'].strip()

		self.__getAccessToken()

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

	def __getUser(self):

		user = None
		access_token = self.__getAccessToken()

		try:
			user = User.objects.get(id=access_token.sub)
			if user:
				return user
			return None
		except Exception as e:
			print(f"WebSocket Error: {e}")
			return None

	def __getAccessToken(self):

		for header_name, header_value in self.scope['headers']:
			if header_name == b'cookie':
				cookies = header_value.decode('utf-8').split('; ')
				for cookie in cookies:
					cookie_name, cookie_value = cookie.split('=')
					if cookie_name == 'access':
						access_cookie = cookie_value
						break

		print("=======================================================")
		print(f"Access Token:\n{access_cookie}")
		print("=======================================================")

		return JwtData(access_cookie)


""" 
Message:

Refresh::
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWNjZXNzIiwic3ViIjoyLCJpYXQiOjE3MTE2MzgxMzYsImV4cCI6MTcxMTYzOTkzNiwianRpIjoiODlhNTY4NjItOGZhNC00ZTc3LThiZTYtMzdhYjRkOTBkYzIzIn0.phtMnS0di0qiXd89ijK48MAooanKU3OK47iT01TS9Zo
"""
