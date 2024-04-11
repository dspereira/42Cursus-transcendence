from django.urls import path
from . import views

urlpatterns = [
	path('test', views.apiTest, name='apiTest'),
	path('create_room', views.apiCreateRoom, name='apiCreateRoom'),
	path('delete_room', views.apiDeleteRoom, name='apiDeleteRoom'),
	path('delete_all_rooms', views.apiDeleteAllRooms, name='apiDeleteAllRooms'),
	path('list_rooms', views.apiListRooms, name='apiListRooms'),
	path('get_chat_room/', views.apiGetChatRoom, name='apiGetChatRoom'),
	path('get_user_chat_rooms/', views.apiGetUserChatRooms, name='apiGetUserChatRooms'),
	path('add_user_to_chat_room', views.apiAddUserToChatRoom, name='apiAddUserToChatRoom'),
	path('check_user_chat_room_access/', views.apiCheckUserChatRoomAccess, name='apiCheckUserChatRoomAccess'),
]
