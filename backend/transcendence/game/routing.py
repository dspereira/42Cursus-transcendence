from django.urls import re_path
from . import consumers

game_urls = [
	re_path(r'game/(?P<game_id>\d+)/$', consumers.Game.as_asgi()),
]
