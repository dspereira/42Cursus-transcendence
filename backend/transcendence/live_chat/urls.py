from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='chat-index'),
    path('<str:room_name>/', views.room_view, name='chat-room'),
	path('api/test', views.apiTest, name='apiTest'),
	path('api/create_room', views.apiCreateRoom, name='apiCreateRoom'),
	path('api/delete_room', views.apiDeleteRoom, name='apiDeleteRoom'),
	path('api/delete_all_rooms', views.apiDeleteAllRooms, name='apiDeleteAllRooms'),
	path('api/list_rooms', views.apiListRooms, name='apiListRooms'),
	path('api/get_chat_room/', views.apiGetChatRoom, name='apiGetChatRoom'),
	path('api/get_user_chat_rooms/', views.apiGetUserChatRooms, name='apiGetUserChatRooms'),
	path('api/add_user_to_chat_room', views.apiAddUserToChatRoom, name='apiAddUserToChatRoom'),
	path('api/check_user_chat_room_access/', views.apiCheckUserChatRoomAccess, name='apiCheckUserChatRoomAccess'),
]
