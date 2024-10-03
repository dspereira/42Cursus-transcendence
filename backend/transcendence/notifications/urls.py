from django.urls import path
from . import views

urlpatterns = [
	path('create_friend_notification', views.create_friend_notification, name='create_friend_notification'),
	path('requests-notifications/', views.requests_notifications),
]
