from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='chat-index'),
    path('<str:room_name>/', views.room_view, name='chat-room'),
	path('api/test', views.apiTest, name='apiTest'),
]
