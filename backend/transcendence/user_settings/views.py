from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from user_settings.models import UserSettings
from django.http import JsonResponse
from user_auth.models import User
import json

user_model = ModelManager(User)
user_settings_model = ModelManager(UserSettings)

@login_required
@accepted_methods(["GET"])
def get_language(request):
	user_settings = user_settings_model.get(user_id=request.access_data.sub)
	if user_settings:
		return JsonResponse({"message": "Language retrieved with success!", "language": user_settings.language}, status=200)
	return JsonResponse({"message": "User not found"}, status=409)

@login_required
@accepted_methods(["GET"])
def get_game_theme(request):
	user_settings = user_settings_model.get(user_id=request.access_data.sub)
	if user_settings:
		return JsonResponse({"message": "Game Theme retrieved with success!", "gameTheme": user_settings.game_theme}, status=200)
	return JsonResponse({"message": "User not found"}, status=409)

@login_required
@accepted_methods(["GET"])
def get_all_info(request):
	user_settings = user_settings_model.get(user_id=request.access_data.sub)
	if user_settings:
		return JsonResponse({
			"message": "User settings retrieved with success!",
			"language": user_settings.language,
			"gameTheme": user_settings.game_theme
		}, status=200)		
	return JsonResponse({"message": "User not found"}, status=409)

@login_required
@accepted_methods(["POST"])
def set_new_settings(request):
	user_to_alter = user_settings_model.get(user_id=request.access_data.sub)
	if	user_to_alter:
		if request.body:
			req_data = json.loads(request.body.decode('utf-8'))
			if req_data.get("newLanguage"):
				user_to_alter.language = req_data.get("newLanguage")
			if req_data.get("newTheme"):
				user_to_alter.game_theme = req_data.get("newTheme")
			user_to_alter.save()
			return JsonResponse({"message": "User settings updated with cuccess!"}, status=200)
		else:
			return JsonResponse({"message": "Bad Request: Request body is required"}, status=400)
	return JsonResponse({"message": "User not found"}, status=409)
