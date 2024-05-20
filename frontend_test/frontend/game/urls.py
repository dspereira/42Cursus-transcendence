from django.urls import path
from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("game_create/", views.game_create, name="game_create"),
	path("game/", views.actual_game, name="game"),
]