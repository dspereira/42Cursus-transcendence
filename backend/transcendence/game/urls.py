from django.urls import path
from .GameRequestView import GameRequestView
from .GameView import GameView
from . import views

urlpatterns = [
	path('request/', GameRequestView.as_view(), name='request'),
	path('game/', GameView.as_view(), name='game'),
    
	path('color_pallet/', views.color_pallet, name='color_pallet'),		# Verificar opinião do Pereira
    path('color_pallet_local/', views.color_pallet_local, name='color_pallet_local'),

	# Rotas apenas para testes
	path('test/', views.test, name='test'),
	path('set_game_scores/', views.set_game_score_info, name='test'),
	path('set_game_as_finished/', views.set_game_as_finished, name='test'),
]
