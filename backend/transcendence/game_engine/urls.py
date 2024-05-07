from django.urls import path
from . import views

urlpatterns = [
	path('player-input', views.player_controls, name="player_controls"),
	path('finish-match', views.finish_match, name="finish_match"),
	path('start-match', views.create_match, name="create_match"),
]