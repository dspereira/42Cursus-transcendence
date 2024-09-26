from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from django.http import JsonResponse
from user_auth.models import User
from .models import Games
from user_settings.models import UserSettings
import json

from .utils import has_user_pending_game_requests
from .utils import get_games_list

user_model = ModelManager(User)
game_model = ModelManager(Games)
user_settings_model = ModelManager(UserSettings)

CLASSIC_RETRO = {
	"ground": "#101010", 
	"paddle": "#FFFFFF", 
	"ball": "#FFD700", 
	"score": "rgba(255, 255, 255, 0.8)", 
	"middleLine": "#FFFFFF"
}

MODERN_NEON = {
	"ground": "#000000",
	"paddle": "#00FF00",
	"ball": "#FF00FF",
	"score": "rgba(255, 255, 255, 0.7)",
	"middleLine": "#00FF00"
}

OCEAN_VIBES = {
	"ground": "#001F3F", 
	"paddle": "#00AFFF", 
	"ball": "#00DFFF", 
	"score": "rgba(255, 255, 255, 0.7)", 
	"middleLine": "#00DFFF"
}

SUNSET_GLOW = {
	"ground": "#FF4500", 
	"paddle": "#FFD700", 
	"ball": "#FFD700", 
	"score": "rgba(255, 255, 255, 0.7)", 
	"middleLine": "#FFD700"
}

FOREST_RETREAT = {
	"ground": "#022B19", 
	"paddle": "#98FB98", 
	"ball": "#32CD32", 
	"score": "rgba(255, 255, 255, 0.5)", 
	"middleLine": "#32CD32"
}

COLOR_PALLETS = [CLASSIC_RETRO, MODERN_NEON, OCEAN_VIBES, SUNSET_GLOW, FOREST_RETREAT]

@login_required
@accepted_methods(["GET"])
def color_pallet(request):
	user = user_model.get(id=request.access_data.sub)
	if user:
		user_settings = user_settings_model.get(user=user)
		if not user_settings:
			return JsonResponse({"message": "Error: User has no settings defined!"}, status=409)
		choosed_color_pallet = user_settings.game_theme
		return JsonResponse({"message": "Color Pallet Retrieved With Success", "color_pallet": COLOR_PALLETS[choosed_color_pallet]}, status=200)	
	return JsonResponse({"message": "Error: User not found!"}, status=409)

@login_required
@accepted_methods(["GET"])
def get_games(request):
	username = request.GET.get('username')
	if username:
		user = user_model.get(username=username)
	else:
		user = user_model.get(id=request.access_data.sub)
	if user:
		games_list = get_games_list(user=user)
		return JsonResponse({"message": f"Game request list retrieved with success.", "games_list": games_list}, status=200)
	else:
		return JsonResponse({"message": "Error: User not found!"}, status=404)

@login_required
@accepted_methods(["GET"])
def has_pending_game_requests(request):
	user = user_model.get(id=request.access_data.sub)
	if user:
		flag = has_user_pending_game_requests(user)
		return JsonResponse({"message": f"Pending game requests flag returned with success.", "has_pending_game_requests": flag}, status=200)
	else:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)
