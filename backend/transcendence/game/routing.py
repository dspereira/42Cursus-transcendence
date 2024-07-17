from django.urls import re_path
from . import consumers

game_urls = [
	re_path(r'game/', consumers.Game.as_asgi()),
]
