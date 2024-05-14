from django.urls import path
from . import views

urlpatterns = [
	path('create-tournament', views.create_tournament, name="create_tournament"),
	path('invite-tournament', views.invite_to_tournament, name="invite_to_tournament"),
	path('update-tournament', views.update_tournament, name="update_tournament"),
	path('results-tournament', views.get_results, name="results_tournament"),
]