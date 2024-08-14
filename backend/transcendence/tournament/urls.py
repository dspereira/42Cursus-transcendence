from django.urls import path
from .TournamentRequestsView import TournamentInvitesView
from .TournamentView import TournamentView
from . import views

urlpatterns = [
	path('', TournamentView.as_view(), name='tournament'),
	path('invite/', TournamentInvitesView.as_view(), name='invite'),
    path('is-tournament-owner/', views.is_tournament_owner, name='is_tournament_owner'),
    path('tournament-status/', views.get_tournament_state, name='get_tournament_state'),
    path('tournament-players/', views.get_tournament_players, name='get_tournament_players'),
    path('active-tournament/', views.active_tournament, name='active_tournament_'),
]
