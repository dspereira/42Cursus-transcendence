"""
ASGI config for transcendence project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from custom_middlewares import ChannelsAuthMiddleware
from notifications.routing import notifications_urls
from live_chat.routing import chat_urls

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence.settings')

websocket_urls = chat_urls + notifications_urls

application = ProtocolTypeRouter({
	'http': get_asgi_application(),
	"websocket": AllowedHostsOriginValidator(
		ChannelsAuthMiddleware(
			URLRouter(websocket_urls)
		),
	),
})
