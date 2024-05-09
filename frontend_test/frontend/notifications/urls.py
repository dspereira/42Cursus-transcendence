from django.urls import path
from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("check_notifications/", views.check_notifications, name="check_notifications"),
]
