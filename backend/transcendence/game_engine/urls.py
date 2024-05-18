from django.urls import path
from . import views

urlpatterns = [
	path('player-input', views.player_controls, name="player_controls"),
	path('pause-game', views.pause_game, name="pause_game"),
	path('create-game', views.create_match, name="create_game"),
	path('update-game', views.game_update, name="create_game"),
	path('check-id', views.check_id, name="check_id")
]