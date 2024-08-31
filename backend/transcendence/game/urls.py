from django.urls import path
from .GameRequestView import GameRequestView
from . import views

urlpatterns = [
	path('request/', GameRequestView.as_view(), name='request'),
	path('get-games/', views.get_games, name='get_game'),
	path('has-pending-game-requests/', views.has_pending_game_requests, name='has_pending_game_requests'),
	path('color_pallet/', views.color_pallet, name='color_pallet'),		# Verificar opinião do Pereira
]
