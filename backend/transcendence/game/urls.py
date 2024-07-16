from django.urls import path
from .GameRequestView import GameRequestView
from .GameView import GameView
from . import views

urlpatterns = [
	path('request/', GameRequestView.as_view(), name='request'),
	path('game/', GameView.as_view(), name='game'),
    
	# Rotas apenas para testes
	path('test/', views.test, name='test'),
	path('set_game_scores/', views.set_game_score_info, name='test'),
	path('set_game_as_finished/', views.set_game_as_finished, name='test'),
]
