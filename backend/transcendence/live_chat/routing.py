from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
	re_path(r'chat_connection/$', consumers.ChatConsumer.as_asgi()),
]
