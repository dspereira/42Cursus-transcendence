from django.urls import path
from . import views

urlpatterns = [
    path('getfriends', views.get_friends, name="getfrirends"),                         # Precisa de ser Revisto
    path('blockuser', views.block_user, name='blockuser'),                             # Precisa de ser Revisto
    path('unblockuser/', views.unblock_user, name='unblockuser'),                      # Precisa de ser Revisto
    path('create_request/', views.create_friend_request, name='create_request'),
    path('accept_request/', views.accept_friend_request, name='accept_request'),
    path('decline_request/', views.decline_friend_request, name='decline_request'),
    path('remove_friendship/', views.remove_friendship, name='remove_friendship'),
]