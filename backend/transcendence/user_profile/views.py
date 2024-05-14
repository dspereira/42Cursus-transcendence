from django.shortcuts import render
from user_profile.models import UserProfileInfo
from user_auth.models import User
from django.http import JsonResponse
import json
from django.views.decorators.http import require_http_methods
import os
from custom_utils.models_utils import ModelManager
from user_profile.forms import ImageForm
import base64
import imghdr
from custom_decorators import accepted_methods, login_required

user_model = ModelManager(User)
user_profile_info_model = ModelManager(UserProfileInfo)

@accepted_methods(["GET"])
def api_show_image(request):
	user = user_profile_info_model.get(user_id=request.GET.get("user_id"))
	if user:
		if user.profile_image:
			profile_image = bytes(user.profile_image)
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
			default_image_url = "https://api.dicebear.com/8.x/bottts/svg?seed=" + user.default_image_seed
			result = {
                "image_url": default_image_url
            }
	else:
		result = {
			"message": "Error: No User"
		}
	return JsonResponse(result)

@accepted_methods(["POST"])
def api_update_profile_picture(request):
	user_to_alter = user_profile_info_model.get(user_id=request.POST.get("user_id"))
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

@accepted_methods(["POST"])
def api_edit_bio(request):
	if request.body:
		req_data = json.loads(request.body)
		user_to_alter = user_profile_info_model.get(user_id=req_data["user_id"])
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
'''
@login_required
@accepted_methods(["POST", "GET"]) #escrever na DB
def api_edit_bio(request):
	user_id = request.access_data.sub
	print(user_id)
	type = request.method
	return JsonResponse({"result": type})
'''