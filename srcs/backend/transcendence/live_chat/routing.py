from django.urls import re_path
from . import consumers

chat_urls = [
	re_path(r'ws/chat_connection/', consumers.ChatConsumer.as_asgi()),
]
