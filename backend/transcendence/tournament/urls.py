from django.urls import path
from . import views

urlpatterns = [
	path('create-tournament', views.create_tournament, name="create_tournament"),
	path('invite-users', views.invite_to_tournament, name="invite_to_tournament"),
	path('update-tournament', views.update_tournament, name="update_tournament"),
]