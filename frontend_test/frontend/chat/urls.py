from django.urls import path
from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("create_chatroom/", views.create_chatroom, name="create_chatroom"),
	path("delete_chatroom/", views.delete_chatroom, name="delete_chatroom"),
	path("list_chatroom/", views.list_chatroom, name="list_chatroom"),
	path("chatroom/<str:room_id>/", views.chatroom, name="chatroom"),
]
