from django.urls import path
from . import views

urlpatterns = [
	path('request', views.apiSendFriendRequest, name='request'),
    path('accept', views.apiAcceptFriendRequest, name='accept'),
    path('decline', views.apiDeclineFriendRequest, name='decline'),
    path('editbio', views.apiEditBio, name='editbio'),
    path('updatepicture', views.apiUpdateProfilePicture, name='updatepicture'),
    path('test', views.apiCreatUserInfo, name='test'),
]
