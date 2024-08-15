from django.urls import path
from .TournamentRequestsView import TournamentInvitesView
from .TournamentView import TournamentView
from . import views

urlpatterns = [
	path('', TournamentView.as_view(), name='tournament'),
	path('invite/', TournamentInvitesView.as_view(), name='invite'),
    path('is-owner/', views.is_tournament_owner, name='is_tournament_owner'),
    path('status/', views.get_tournament_state, name='get_tournament_state'),
    path('players', views.tournament_players, name='get_tournament_players'),
    path('active-tournament/', views.active_tournament, name='active_tournament'),
    path('friend-list/', views.friend_list, name='friend_list'),
]
