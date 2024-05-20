from custom_decorators import accepted_methods, login_required
from friendships.friendships import get_friend_list
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from user_profile.aux import get_image_url
from user_profile.forms import ImageForm
from django.http import JsonResponse
from user_auth.models import User
import json

user_model = ModelManager(User)
user_profile_info_model = ModelManager(UserProfileInfo)

@login_required
@accepted_methods(["GET"])
def api_get_all_info(request):
	user = user_profile_info_model.get(user_id=request.access_data.sub)
	if user:
		image_url = get_image_url(user)
		username = user_model.get(id=request.access_data.sub).username
		if image_url:
			result = {
				"username": username,
				"bio": user.bio,
				"image": image_url,
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
def api_show_friends(request):
	user = user_profile_info_model.get(user_id=request.access_data.sub)
	if user:
		friend_list = get_friend_list(user)
		if friend_list:
			result = {
				"friends": ""
			}
			for friend in friend_list:
				if result["friends"]:
					result += ", " #add the logic to see if the user is the frist or second user in the collomn
				#else:
				#	result += #add the logic to see if the user is the frist or second user in the collomn
		else:
			result = {
			"message": "User has no friends"
		}
	else:
		result = {
			"message": "Error: Can't find user"
		}
	return JsonResponse(result)

@login_required
@accepted_methods(["GET"])
def api_show_image(request):
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
def api_update_profile_picture(request):
	user_to_alter = user_profile_info_model.get(user_id=request.access_data.sub)
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
			"message": "Error: Can't find user"
			}
	else:
		result = {
			"message": "Error: No Image"
			}
	return JsonResponse(result)

@login_required
@accepted_methods(["POST"])
def api_edit_bio(request):
	print(request)
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