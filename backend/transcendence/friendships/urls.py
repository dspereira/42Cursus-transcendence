from django.urls import path
from . import views

urlpatterns = [
    path('getfriends', views.get_friends, name="getfrirends"),
    path('blockuser', views.block_user, name='blockuser'),
    path('unblockuser', views.unblock_user, name='unblockuser')
    #path('forcefriends', views.force_friendship, name="getfrirends") #for testing only, will delete later
]
