from user_profile.aux import get_image_url, set_new_bio, set_new_username, set_new_default_seed, set_new_profile_picture
from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from user_profile.forms import ImageForm
from django.http import JsonResponse
from user_auth.models import User
import json

from PIL import Image
from io import BytesIO

from .aux import get_user_profile_data

user_model = ModelManager(User)
user_profile_info_model = ModelManager(UserProfileInfo)

import os

@login_required
@accepted_methods(["POST"])
def set_new_configs(request):
	user_to_alter = user_profile_info_model.get(user_id=request.access_data.sub)
	if	user_to_alter:
		if request.body:
			req_data = json.loads(request.body.decode('utf-8'))
			if req_data.get("newUsername"):
				if not set_new_username(user_model.get(id=request.access_data.sub), req_data.get("newUsername")):
					return JsonResponse({"message": "Username already exists"}, status=409)
			if req_data.get("newBio"):
				set_new_bio(user_to_alter, req_data.get("newBio"))
			if req_data.get("newSeed"):
				set_new_default_seed(user_to_alter, req_data.get("newSeed"))
			return JsonResponse({"message": "success"})
		else:
			return JsonResponse({"message": "Bad Request: Request body is required"}, status=400)
	else:
		return JsonResponse({"message": "User not found"}, status=404)

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
@accepted_methods(["POST"])
def set_profile_picture(request):

	print("---------------")
	print("POST")
	print(request.POST)
	print("---------------")
	print("FILES")
	print(request.FILES)
	print("---------------")

	user_to_alter = user_profile_info_model.get(user_id=request.access_data.sub)
	form = ImageForm(request.POST, request.FILES)
	if form.is_valid():
		file = request.FILES['image']
		new_image_data = file.read()
		if user_to_alter:
			user_to_alter.profile_image = new_image_data

			nome_arquivo, extensao = os.path.splitext(file.name)
			print()
			print("Image:")
			print(request.FILES['image'])
			print("Extenção:", extensao)
			print()

			image = Image.open(BytesIO(new_image_data))
			output = BytesIO()
			image.save(output, format='JPEG', quality=25) #quality goes from 1 up to 95 (the lower the number the lighter and lower quality the image)
			compressed_image_data = output.getvalue()
			user_to_alter.compressed_profile_image = compressed_image_data
			user_to_alter.save()
		else:
			return JsonResponse({"message": "User not found"}, status=404)
	return JsonResponse({"message": "success"})

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
def get_image(request):
	user_profile = user_profile_info_model.get(id=request.access_data.sub)
	if user_profile:
		user_image = get_image_url(user=user_profile)
		return JsonResponse({"message": "User profile image getted with success.", "image": user_image}, status=200)
	else:
		return JsonResponse({"message": "Error: User does not Exist"}, status=409)
