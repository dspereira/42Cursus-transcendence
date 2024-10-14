from django.urls import re_path
from . import consumers

game_urls = [
	re_path(r'ws/game/(?P<lobby_id>\w+)/$', consumers.Game.as_asgi()),
]
