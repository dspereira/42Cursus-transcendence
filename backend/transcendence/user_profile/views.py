from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from user_profile.aux import get_image_url
from user_profile.forms import ImageForm
from django.http import JsonResponse
from user_auth.models import User
import json

from PIL import Image
from io import BytesIO

user_model = ModelManager(User)
user_profile_info_model = ModelManager(UserProfileInfo)

@login_required
@accepted_methods(["POST"])
def set_new_default_seed(request):
	if request.body:
		user = user_profile_info_model.get(user_id=request.access_data.sub)
		if user:
			req_data = json.loads(request.body.decode('utf-8'))
			user.default_image_seed = req_data["new_seed"]
			user.save()
			result = {
				"new_default_seed": user.default_image_seed
			}
		else:
			result = {
				"message": "Error: No User"
			}
	else:
		result = {
			"message": "Error: Empty Body"
		}
	return JsonResponse(result)

@login_required
@accepted_methods(["GET"])
def get_all_info(request):
	user = user_profile_info_model.get(user_id=request.access_data.sub)
	if user:
		image_url = get_image_url(user)
		username = user_model.get(id=request.access_data.sub).username
		if image_url:
			print(image_url)
			result = {
				"username": username,
				"bio": user.bio,
				"image_url": image_url,
				"total_games": user.total_games,
				"victories": user.victories,
				"defeats": user.defeats,
				"win_rate": user.win_rate,
				"tournaments_won": user.tournaments_won,
			}
		else:
			result = {
				"message": "Error: Image type not supported"
			}
	else:
		result = {
			"message": "Error: No User"
		}
	return JsonResponse(result)

@login_required
@accepted_methods(["GET"])
def get_image(request):
	if not request.body:
		user = user_profile_info_model.get(user_id=request.access_data.sub)
	else:
		user = user_profile_info_model.get(user_id=request.GET.get("user_id"))
	if user:
		image_url = get_image_url(user)
		if image_url:
			result = {
                "image_url": image_url
            }
		else:
			result = {
				"message": "Error: Image type no supported"
			}
	else:
		result = {
			"message": "Error: Can't find user"
		}
	return JsonResponse(result)

@login_required
@accepted_methods(["POST"])
def set_profile_picture(request):
	user_to_alter = user_profile_info_model.get(user_id=request.access_data.sub)
	form = ImageForm(request.POST, request.FILES)
	if form.is_valid():
		new_image_data = request.FILES['image'].read()
		if user_to_alter:
			user_to_alter.profile_image = new_image_data

			#new aditions
			image = Image.open(BytesIO(new_image_data))
			output = BytesIO()
			image.save(output, format='JPEG', quality=50) #quality goes from 1 up to 95 (the lower the number the lighter and lower quality the image)
			compressed_image_data = output.getvalue()
			user_to_alter.compressed_profile_image = compressed_image_data

			user_to_alter.save()
			result = {
				"message": "Altered Profile Picture"
			}
		else:
			result = {
			"message": "Error: Can't find user"
			}
	else:
		result = {
			"message": "Error: No Image"
			}
	return JsonResponse(result)

@login_required
@accepted_methods(["POST"])
def set_bio(request):
	user_to_alter = user_profile_info_model.get(user_id=request.access_data.sub)
	if	user_to_alter:
		if request.body:
			req_data = json.loads(request.body.decode('utf-8'))
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
	else:
		result = {
		"message": "Error: Can't find user"
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