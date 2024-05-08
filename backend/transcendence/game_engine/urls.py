from django.urls import path
from . import views

urlpatterns = [
	path('player-input', views.player_controls, name="player_controls"),
	path('pause-game', views.pause_game, name="pause_game"),
]