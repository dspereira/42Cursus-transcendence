from django.urls import path
from . import views

urlpatterns = [
	path('request', views.api_send_friend_request, name='request'),
    path('accept', views.api_accept_friend_request, name='accept'),
    path('decline', views.api_decline_friend_request, name='decline'),
    path('friendlist', views.api_get_friend_list, name='friendlist'),
]
