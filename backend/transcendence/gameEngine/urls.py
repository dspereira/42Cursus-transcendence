from django.urls import path
from . import views


urlpatterns = [
    path('playerControls', views.playerControls, name="playerControls"),
]