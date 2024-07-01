from .FriendRequestView import FriendRequestView
from .FriendsView import FriendsView
from django.urls import path
from . import views

urlpatterns = [
	path('blockuser', views.block_user, name='blockuser'),									# Precisa de ser Revisto
	path('unblockuser/', views.unblock_user, name='unblockuser'),							# Precisa de ser Revisto
	path('request/', FriendRequestView.as_view(), name='request'),
	path('friendships/', FriendsView.as_view(), name='friendships'),
	path('search_user_by_name/', views.search_user_by_name, name='search_user_by_name'),
	path('search/', views.search_friend_by_name, name='search_friend_by_name'),				# Para remover depois de testes
]
