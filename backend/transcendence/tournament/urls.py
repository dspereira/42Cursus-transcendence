from django.urls import path
from .TournamentRequestsView import TournamentInvitesView
from .TournamentView import TournamentView
from . import views

urlpatterns = [
	path('invite/', TournamentInvitesView.as_view(), name='invite'),
	path('/', TournamentView.as_view(), name='tournament'),
]
