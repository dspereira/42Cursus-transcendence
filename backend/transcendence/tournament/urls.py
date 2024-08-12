from django.urls import path
from .TournamentRequestsView import TournamentRequestsView
from . import views

urlpatterns = [
	path('request/', TournamentRequestsView.as_view(), name='request'),
]
