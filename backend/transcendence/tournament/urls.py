from django.urls import path
from .TournamentRequestsView import TournamentInvitesView
from .TournamentView import TournamentView
from .TournamentPlayersView import TournamentPlayersView
from . import views

urlpatterns = [
	path('', TournamentView.as_view(), name='tournament'),
	path('invite/', TournamentInvitesView.as_view(), name='invite'),
    path('is-owner/', views.is_tournament_owner, name='is_tournament_owner'),
    path('status/', views.get_tournament_state, name='get_tournament_state'),
    path('players/', TournamentPlayersView.as_view(), name='get_tournament_players'),
    path('active-tournament/', views.active_tournament, name='active_tournament'),
    path('friend-list/', views.friend_list, name='friend_list'),
    path('invited-friends/', views.invited_users_to_tournament, name='invited_users'),
    path('cancel-invite/', views.cancel_invite, name='cancel_invite'),
    path('start/', views.start_tournament, name='start_tournament'),
    path('games/', views.games_list, name='games_list'),
    path('next-game/', views.next_game, name='next_game'),
]
