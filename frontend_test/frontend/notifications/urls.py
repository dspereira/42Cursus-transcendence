from django.urls import path
from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("check_notifications/", views.check_notifications, name="check_notifications"),
	path("create_notifications/", views.create_notifications, name="create_notifications"),
	path("friend_request/", views.friend_request, name="friend_request"),
	path("game_invite/", views.game_invite, name="game_invite"),
]
