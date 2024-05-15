from django.urls import path
from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("tournament_control/", views.tournament_control, name="tournament_control"),
]