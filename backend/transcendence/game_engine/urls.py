from django.urls import path
from . import views

urlpatterns = [
	path('player-input', views.player_controls, name="player_controls"),
	path('finish-match', views.update_DB, name="finish_match"),
]