from django.shortcuts import render
from custom_decorators import login_required, accepted_methods
from user_auth.models import User
from custom_utils.models_utils import ModelManager
from .models import FriendsRequestNotification

user_model = ModelManager(User)
friend_request_notification_model = ModelManager(FriendsRequestNotification)

@accepted_methods(["POST"])
def create_friend_notification(request):
	pass