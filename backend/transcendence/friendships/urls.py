from .FriendRequestView import FriendRequestView
from .BlockStatusView import BlockStatusView
from .FriendsView import FriendsView
from django.urls import path
from . import views

urlpatterns = [
	path('search_user_by_name/', views.search_user_by_name, name='search_user_by_name'),
	path('friendships/', FriendsView.as_view(), name='friendships'),
	path('request/', FriendRequestView.as_view(), name='request'),
	path('chat-list/', views.chat_list, name='chat_list'),
	path('block/', BlockStatusView.as_view(), name='block'),
	path('is-friend/', views.is_friend, name='is-friend'),
]
