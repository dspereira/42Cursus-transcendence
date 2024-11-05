from user_profile.utils import get_image_url, set_new_bio, set_new_username, set_new_default_seed, set_new_profile_picture
from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from user_profile.forms import ImageForm
from django.http import JsonResponse
from user_auth.models import User
import json

from PIL import Image
from io import BytesIO

from .utils import get_user_profile_data

user_model = ModelManager(User)
user_profile_info_model = ModelManager(UserProfileInfo)

import os

@login_required
@accepted_methods(["GET"])
def get_profile_data(request):
	username = request.GET.get('username')
	if username:
		user = user_model.get(username=username)
	else:
		user = user_model.get(id=request.access_data.sub)
	if not user:
		return JsonResponse({"message": "User not found"}, status=409)
	profile_data = get_user_profile_data(user)
	return JsonResponse({"message": "Profile data retrieved with success!", "data": profile_data}, status=200)

@login_required
@accepted_methods(["GET"])
def get_image(request):
	user = user_profile_info_model.get(user_id=request.access_data.sub)
	if user:
		image_url = get_image_url(user)
		return JsonResponse({"image": image_url})
	else:
		return JsonResponse({"message": "User not found"}, status=404)

@login_required
@accepted_methods(["GET"])
def exist_user_profile(request):
	username = request.GET.get('username')
	if not username:
		return JsonResponse({"message": "Invalid Request"}, status=400)
	exist = False
	if user_model.get(username=username):
		exist = True
	return JsonResponse({"message": "User existence verified successfully!", "exists": exist}, status=200)

@login_required
@accepted_methods(["GET"])
def username(request):
	if not request.GET.get('id') or not str(request.GET.get('id')).isdigit():
		return JsonResponse({"message": "Error: Bad Request"}, status=400)
	user = user_model.get(id=request.access_data.sub)
	if user:
		user_to_check = user_model.get(id=request.GET['id'])
		if not user_to_check:
			return JsonResponse({"message": "User does not exist!"}, status=409)
		return JsonResponse({"message": "Friend info Returned With Success", "username": user_to_check.username}, status=200)
	return JsonResponse({"message": "Error: Invalid User"}, status=401)
