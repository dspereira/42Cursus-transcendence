from django.urls import path
from . import views

urlpatterns = [
    path('getfriends', views.get_friends, name="getfrirends"),                         # Precisa de ser Revisto
    path('blockuser', views.block_user, name='blockuser'),                             # Precisa de ser Revisto
    path('unblockuser/', views.unblock_user, name='unblockuser'),                      # Precisa de ser Revisto
    path('request/', views.friend_request, name='request'),
    path('accept_request/', views.accept_friend_request, name='accept_request'),
    path('decline_request/', views.decline_friend_request, name='decline_request'),
    path('remove_friendship/', views.remove_friendship, name='remove_friendship'),
    path('search_user_by_name/', views.search_user_by_name, name='search_user_by_name'),
    path('search/', views.search_friend_by_name, name='search_friend_by_name'),
]
