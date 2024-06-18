from django.urls import re_path
from . import consumers

notifications_urls = [
	re_path(r'notifications/', consumers.Notifications.as_asgi()),
]
