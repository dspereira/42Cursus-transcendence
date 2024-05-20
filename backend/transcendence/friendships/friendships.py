from django.shortcuts import render
from friendships.models import FriendList, FriendRequests
from user_auth.models import User
from django.http import JsonResponse
import json
import os
from custom_utils.models_utils import ModelManager
from custom_decorators import accepted_methods, login_required

friend_list_model = ModelManager(FriendList)
friend_requests_model = ModelManager(FriendRequests)
user_model = ModelManager(User)

def get_friend_list(user_id):
	user = user_model.get(user_id=user_id)
	if user:
		filtered_list1 = friend_list_model.filter(user1=user)
		filtered_list2 = friend_list_model.filter(user2=user)
		if filtered_list1 and filtered_list2:
			filtered_list = filtered_list1 | filtered_list2
		if filtered_list:
			data = list(filtered_list)
	return data

def accept_friend_request(request_id):
	if request_id:
		friend_request = friend_requests_model.get(id=request_id)
		if friend_request:
			friend_list_model.create(user1=friend_request.from_user , user2=friend_request.to_user)
			result = {
				"message": friend_request.to_user + " accepted your friend request.",
			}
			friend_request.delete()
		else:
			result = {
				"message": "Error: request_id does not exist"
			}
	else:
		result = {
			"message": "Error: No request_id"
		}
	return JsonResponse(result)

def decline_friend_request(request_id):
	if request_id:
		friend_request = friend_requests_model.get(id=request_id)
		if friend_request:
			result = {
				"message": friend_request.to_user + " declined your friend request",
			}
			friend_request.delete()
		else:
			result = {
				"message": "Error: request_id does not exist"
			}
	else:
		result = {
			"message": "Error: No request_id"
		}
	return JsonResponse(result)

def send_friend_request(request):
	if request.body:
		req_data = json.loads(request.body)
		user = user_model.get(id=req_data["user"])
		requested_user = user_model.get(id=req_data["requested_user"])
		if requested_user:
			checker1 = friend_list_model.get(user1=user, user2=requested_user)
			checker2 = friend_list_model.get(user1=requested_user, user2=user)
			if checker1 or checker2:
				result = {
					"message": "Error: friendship already exists"
				}
				return JsonResponse(result)
			checker1 = friend_requests_model.get(from_user=user, to_user=requested_user)
			if checker1 or checker2:
				result = {
					"message": "Error: friendship already requested"
				}
				return JsonResponse(result)
			friend_requests_model.create(from_user=user, to_user=requested_user)
			result = {
				"message": "Friendhip request sent",
				"user": user.username,
				"requested_user": requested_user.username
			}
		else:
			result = {
				"message": "Error: requested_user does not exist"
			}
	else:
		result = {
			"message": "Error: Empty Body"
		}

	return JsonResponse(result)