from django.shortcuts import render
from user_profile.models import FriendLinks, FriendRequests, UserProfileInfo
from user_auth.models import User
from django.http import JsonResponse
import json
from django.views.decorators.http import require_http_methods
import os
from custom_utils.models_utils import ModelManager
from user_profile.forms import ImageForm
import base64
import imghdr

friend_links = ModelManager(FriendLinks)
friend_requests = ModelManager(FriendRequests)
user_model = ModelManager(User)
user_info = ModelManager(UserProfileInfo)

@require_http_methods(["GET"])
def apiShowImage(request):
    user = user_info.get(user_id=request.GET.get("user_id"))
    if user:
        profile_image = bytes(user.profile_image)
        if profile_image:
            image_type = imghdr.what(None, h=profile_image)
            if image_type:
                profile_image_base64 = base64.b64encode(profile_image).decode("utf-8")
                result = {
                    "image_url": f"data:image/{image_type};base64,{profile_image_base64}"
                }
            else:
                result = {
                    "message": "Error: Unsupported image type"
                }
        else:
            result = {
                "message": "Error: No Profile Image"
            }
    else:
        result = {
            "message": "Error: No User"
        }
    return JsonResponse(result)

@require_http_methods(["POST"]) #escrever na DB
def apiUpdateProfilePicture(request):
	user_to_alter = user_info.get(user_id=request.POST.get("user_id"))
	form = ImageForm(request.POST, request.FILES)
	if form.is_valid():
		new_image_data = request.FILES['image'].read()
		if user_to_alter:
			user_to_alter.profile_image = new_image_data
			user_to_alter.save()
			result = {
				"message": "Altered Profile Picture"
			}
		else:
			result = {
			"message": "Error: No User"
			}
	else:
		result = {
			"message": "Error: No Image"
			}
	return JsonResponse(result)

@require_http_methods(["POST"]) #escrever na DB
def apiEditBio(request):
	if request.body:
		req_data = json.loads(request.body)
		user_to_alter = user_info.get(user_id=req_data["user_id"])
		new_bio = req_data.get("new_bio")
		user_to_alter.bio = new_bio
		user_to_alter.save()
		result = {
			"message": "Bio altered to:",
			"new_bio": new_bio
		}
	else:
		result = {
		"message": "Error: Empty Body"
		}
	return JsonResponse(result)

@require_http_methods(["POST"]) #escrever na DB
def apiAcceptFriendRequest(request):
	if request.body:
		req_data = json.loads(request.body)
		friend_request = friend_requests.get(id=req_data["request_id"])
		if friend_request:
			friend_links.create(user1=friend_request.from_user , user2=friend_request.to_user)
			result = {
				"message": "Friendship accepted",
				"user": friend_request.from_user,
				"requested_user": friend_request.to_user
			}
			friend_request.delete()
	else:
		result = {
			"message": "Error: Empty Body"
		}
	return JsonResponse(result)

@require_http_methods(["POST"]) #escrever na DB
def apiDeclineFriendRequest(request):
	if request.body:
		req_data = json.loads(request.body)
		friend_request = friend_requests.get(id=req_data["request_id"])
		if friend_request:
			result = {
				"message": "Friendship declined",
				"user": friend_request.from_user,
				"requested_user": friend_request.to_user
			}
			friend_request.delete()
	else:
		result = {
			"message": "Error: Empty Body"
		}
	return JsonResponse(result)

@require_http_methods(["POST"]) #escrever na DB
def apiSendFriendRequest(request):
	if request.body:
		req_data = json.loads(request.body)
		user = user_model.get(id=req_data["user"])
		requested_user = user_model.get(id=req_data["requested_user"])
		if requested_user:
			checker1 = friend_links.get(user1=user, user2=requested_user)
			checker2 = friend_links.get(user1=requested_user, user2=user)
			if checker1 or checker2:
				result = {
					"message": "Error: friendship already exists"
				}
				return JsonResponse(result)
			checker1 = friend_requests.get(from_user=user, to_user=requested_user)
			if checker1 or checker2:
				result = {
					"message": "Error: friendship already requested"
				}
				return JsonResponse(result)
			friend_requests.create(from_user=user, to_user=requested_user)
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

#@require_http_methods(["DELETE"]) #apagar da DB