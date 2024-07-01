from .FriendRequestView import FriendRequestView
from .FriendsView import FriendsView
from django.urls import path
from . import views

urlpatterns = [
	path('block-status/', views.update_block_status, name='update_block_status'),
	path('request/', FriendRequestView.as_view(), name='request'),
	path('friendships/', FriendsView.as_view(), name='friendships'),
	path('search_user_by_name/', views.search_user_by_name, name='search_user_by_name'),
]
