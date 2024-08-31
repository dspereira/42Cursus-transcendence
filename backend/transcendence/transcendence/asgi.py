"""
ASGI config for transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

from channels.security.websocket import AllowedHostsOriginValidator
from channels.routing import ProtocolTypeRouter, URLRouter
from custom_middlewares import ChannelsAuthMiddleware
from django.core.asgi import get_asgi_application
from live_chat.routing import chat_urls
from game.routing import game_urls
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence.settings')

websocket_urls = chat_urls + game_urls

application = ProtocolTypeRouter({
	'http': get_asgi_application(),
	"websocket": AllowedHostsOriginValidator(
		ChannelsAuthMiddleware(
			URLRouter(websocket_urls)
		),
	),
})
