from django.shortcuts import render
from django.http import JsonResponse
from custom_decorators import login_required, accepted_methods
from custom_utils.models_utils import ModelManager

from .models import FriendsRequestNotification
from user_auth.models import User

import json

user_model = ModelManager(User)
friend_request_notification_model = ModelManager(FriendsRequestNotification)

@accepted_methods(["POST"])
@login_required
def create_friend_notification(request):
	
	if request.access_data:
		user = user_model.get(id=request.access_data.sub)
	
	if user:
		if request.body:
			req_data = json.loads(request.body.decode('utf-8'))

			print(req_data)

	else:
		return JsonResponse({"message": "User does not exist!"})
