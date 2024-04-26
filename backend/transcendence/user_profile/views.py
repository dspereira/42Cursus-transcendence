from django.shortcuts import render
from user_profile.models import FriendLinks
from user_auth.models import User
from django.http import JsonResponse
import json
from django.views.decorators.http import require_http_methods
import os

from custom_utils.models_utils import ModelManager

friend_links = ModelManager(FriendLinks)
user_model = ModelManager(User)

@require_http_methods(["POST"]) #escrever na DB
def apiCreateFriendLink(request):
	if request.body:
		req_data = json.loads(request.body)
		user = user_model.get(id=req_data["user"])
		requested_user = user_model.get(id=req_data["requested_user"])
		if requested_user:
			checker1 = friend_links.get(user1=user, user2=requested_user)
			print(checker1)
			checker2 = friend_links.get(user1=requested_user, user2=user)
			print(checker2)
			if checker1 or checker2:
				result = {
					"message": "Error: friendship already requested or exists"
				}
				return JsonResponse(result)
			friend_links.create(user1=user, user2=requested_user)
			result = {
				"message": "Pedido de amizade enviado",
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

#@require_http_methods(["GET"]) #ler da DB

#@require_http_methods(["DELETE"]) #apagar da DB