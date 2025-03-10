from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from custom_decorators import login_required, check_request_body
from user_profile.forms import ImageForm
from django.http import JsonResponse
from user_auth.models import User
from django.http import QueryDict
from django.views import View
import json
import os
from .SettingsManager import SettingsManager

user_model = ModelManager(User)

NBR_MEGA_BYTES = 1
MAX_IMAGE_SIZE_MB = NBR_MEGA_BYTES * 1048576

class SettingsView(View):

	@method_decorator(login_required)
	def get(self, request):
		user = user_model.get(id=request.access_data.sub)
		if user:
			user_settings_manager = SettingsManager(user)
			settings = user_settings_manager.get_current_settings()
			return JsonResponse({"message": f"User settings retrieved with success.", "settings": settings}, status=200)
		else:
			return JsonResponse({"message": "Invalid User!"}, status=400)

	@method_decorator(login_required)
	@method_decorator(check_request_body(["username", "image_seed", "tfa", "bio", "language", "game_theme"]))
	def post(self, request):
		if not request.body:
			return JsonResponse({"message": "Empty Body!"}, status=400)
		user = user_model.get(id=request.access_data.sub)
		if user:
			user_settings_manager = SettingsManager(user)
			request_json = request.POST.get('json')
			if request_json:
				req_data = json.loads(request.POST.get('json'))
				if req_data:
					if req_data.get('username'):
						if not user_settings_manager.update_username(req_data['username']):
							return JsonResponse({"message": f"Username already in use!", "field": "username"}, status=409)
					else:
						return JsonResponse({"message": f"Invalid username!", "field": "username"}, status=409)
					if req_data.get('image_seed'):
						if not user_settings_manager.update_image_seed(req_data['image_seed']):
							return JsonResponse({"message": f"Invalid image seed!", "field": "image_seed"}, status=409)
					if req_data.get('tfa'):
						tfa_update = user_settings_manager.update_tfa(req_data['tfa'])
						if tfa_update:
							return JsonResponse({"message": f"Invalid {tfa_update}!", "field": "tfa"}, status=409)
					fields_to_update = {
						'bio': user_settings_manager.update_bio,
						'language': user_settings_manager.update_language,
						'game_theme': user_settings_manager.update_game_theme
					}
					for field, update_method in fields_to_update.items():
						if not update_method(req_data.get(field)):
							return JsonResponse({"message": f"Invalid {field}!", "field": field}, status=409)
			if request.FILES:
				form = ImageForm(request.POST, request.FILES)
				if not form.is_valid():
					return JsonResponse({"message": f"Invalid input image!", "field": "image"}, status=409)
				image_file = request.FILES['image']
				if not self.__is_valid_image_file(image_file.content_type):
					return JsonResponse({"message": f"Invalid image format!", "field": "image"}, status=409)
				if not self.__is_valid_image_size(image_file):
					return JsonResponse({"message": f"Invalid image size!", "field": "image"}, status=409)
				if not user_settings_manager.update_image(image_file):
					return JsonResponse({"message": f"Invalid input image!", "field": "image"}, status=409)
			return JsonResponse({"message": f"User settings updated with success.", "settings": user_settings_manager.get_current_settings()}, status=200)
		else:
			return JsonResponse({"message": "Invalid User!"}, status=400)

	def __is_valid_image_file(self, file_type):
		valid_content_types = {
			"image/png": "PNG",
			"image/jpeg": "JPEG",
			"image/webp": "WEBP",
		}
		if file_type in valid_content_types:
			return True
		return False

	def __is_valid_image_size(self, image_file):
		if image_file.size <= MAX_IMAGE_SIZE_MB:
			return True
		return False
