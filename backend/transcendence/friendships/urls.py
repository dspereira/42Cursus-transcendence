from django.urls import path
from . import views

urlpatterns = [
    path('getfriends', views.get_friends, name="getfrirends"),
    #path('forcefriends', views.force_friendship, name="getfrirends") #for testing only, will delete later
]
