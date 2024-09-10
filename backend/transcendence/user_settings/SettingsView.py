from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from custom_decorators import login_required
from django.http import JsonResponse
from user_auth.models import User
from django.views import View
import json

from .SettingsManager import SettingsManager

user_model = ModelManager(User)

class SettingsView(View):

	@method_decorator(login_required)
	def get(self, request):
		user = user_model.get(id=request.access_data.sub)
		if user:
			user_settings_manager = SettingsManager(user)
			settings = user_settings_manager.get_current_settings()
			return JsonResponse({"message": f"User settings retrieved with success.", "settings": settings}, status=200)
		else:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)

	@method_decorator(login_required)
	def patch(self, request):
		if not request.body:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)
		user = user_model.get(id=request.access_data.sub)
		if user:
			user_settings_manager = SettingsManager(user)
			req_data = json.loads(request.POST.get('json'))

			if not req_data.get('username'):
				if not user_settings_manager.update_username(req_data.get('username')):
					return JsonResponse({"message": f"Error: Username already in use!"}, status=409)
				return JsonResponse({"message": f"Error: Invalid username!"}, status=409)

			fields_to_update = {
				'bio': user_settings_manager.update_bio,
				'language': user_settings_manager.update_language,
				'game_theme': user_settings_manager.update_game_theme,
				'image_seed': user_settings_manager.update_image_seed
			}

			for field, update_method in fields_to_update.items():
				if not update_method(req_data.get(field)):
					return JsonResponse({"message": f"Error: Invalid {field}!"}, status=409)

			return JsonResponse({"message": f"User settings updated with success.", "settings": user_settings_manager.get_current_settings()}, status=200)
		else:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)
