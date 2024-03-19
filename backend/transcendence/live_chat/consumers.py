import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from channels.middleware import BaseMiddleware

from .models import ChatRoom, Message

class ChatConsumer(WebsocketConsumer):

	def connect(self):
		self.accept()

		print("========================================")
		for key, value in self.scope.items():
			print(f"{key}: {value}")
		print("========================================")

		session_id = self.scope["session"].session_key
		user = self.scope["user"]
		room_id = self.scope["url_route"]["kwargs"]["room_id"]
		print(f"WebSocket connected")
		print("Session ID  :", session_id)
		print("Session User:", user)
		print("Session User:", room_id)

	def disconnect(self, close_code):
		print(f"WebSocket disconnected")
		print("Close code -> ", close_code)

	def receive(self, text_data):
		# print(f"WebSocket received message")

		data_json = json.loads(text_data)
		user = self.scope["user"]
		message = data_json['message']

		print(f"{user}: {message}")
