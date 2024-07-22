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
	user = user_settings_model.get(user_id=request.access_data.sub)
	if user:
		data = {
			"language": user.language,
		}
	else:
		return JsonResponse({"message": "User not found"}, status=404)
	return JsonResponse(data)

@login_required
@accepted_methods(["GET"])
def get_game_theme(request):
	user = user_settings_model.get(user_id=request.access_data.sub)
	if user:
		data = {
			"gameTheme": user.game_theme,
		}
	else:
		return JsonResponse({"message": "User not found"}, status=404)
	return JsonResponse(data)

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
			return JsonResponse({"message": "success"})
		else:
			return JsonResponse({"message": "Bad Request: Request body is required"}, status=400)
	else:
		return JsonResponse({"message": "User not found"}, status=404)

@login_required
@accepted_methods(["GET"])
def get_all_info(request):
	user = user_settings_model.get(user_id=request.access_data.sub)
	if user:
		data = {
			"language": user.language,
			"gameTheme": user.game_theme,
		}
	else:
		return JsonResponse({"message": "User not found"}, status=404)
	return JsonResponse(data)