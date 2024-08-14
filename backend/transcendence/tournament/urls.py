from django.urls import path
from .TournamentRequestsView import TournamentInvitesView
from .TournamentView import TournamentView
from . import views

urlpatterns = [
	path('', TournamentView.as_view(), name='tournament'),
	path('invite/', TournamentInvitesView.as_view(), name='invite'),
    path('is-tournament-owner/', views.is_tournament_owner, name='is_tournament_owner'),
]
