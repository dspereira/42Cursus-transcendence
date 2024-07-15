from django.urls import path
from .GameRequestView import GameRequestView
from . import views

urlpatterns = [
	path('request/', GameRequestView.as_view(), name='request'),
	path('test/', views.test, name='test'),
]
