from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from django.http import JsonResponse
from user_auth.models import User
from .models import Games
import json

from .utils import has_user_pending_game_requests
from .utils import get_games_list

user_model = ModelManager(User)
game_model = ModelManager(Games)

CLASSIC_RETRO = {"ground": "#000000", "paddle": "#FFFFFF", "ball": "#FFD700", "score": "rgba(26, 26, 26, 0.8)", "middleLine": "#FFFFFF"}
MODERN_NEON = {"ground": "#1A1A1A", "paddle": "#39FF14", "ball": "#FF1493", "score": "rgba(0, 0, 0, 0.3)", "middleLine": "#39FF14"}
OCEAN_VIBES = {"ground": "#002F4F", "paddle": "#007FFF", "ball": "#00BFFF", "score": "rgba(173, 216, 230, 0.1)", "middleLine": "#00BFFF"}
SUNSET_GLOW = {"ground": "#FF4500", "paddle": "#FFD700", "ball": "#FFD700", "score": "rgba(255, 182, 193, 0.35)", "middleLine": "#FFD700"}
FOREST_RETREAT = {"ground": "#013220", "paddle": "#7CFC00", "ball": "#32CD32", "score": "rgba(152, 251, 152, 0.1)", "middleLine": "#32CD32"}

COLOR_PALLETS = [CLASSIC_RETRO, MODERN_NEON, OCEAN_VIBES, SUNSET_GLOW, FOREST_RETREAT]

@login_required
@accepted_methods(["GET"])
def color_pallet(request):
	if request.GET.get('id'):
		color_id = int(request.GET.get('id'))
		if color_id and color_id <= len(COLOR_PALLETS):
			return JsonResponse({"message": "Color Pallet Retrieved With Success", "color_pallet": COLOR_PALLETS[color_id - 1]}, status=200)	
	return JsonResponse({"message": "Error: Invalid color pallet id!"}, status=400)

@login_required
@accepted_methods(["GET"])
def get_games(request):
	user = user_model.get(id=request.access_data.sub)
	if user:
		games_list = get_games_list(user=user)
		return JsonResponse({"message": f"Game request list retrieved with success.", "games_list": games_list}, status=200)
	else:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)

@login_required
@accepted_methods(["GET"])
def has_pending_game_requests(request):

	user = user_model.get(id=request.access_data.sub)
	if user:
		flag = has_user_pending_game_requests(user)
		return JsonResponse({"message": f"Pending game requests flag returned with success.", "has_pending_game_requests": flag}, status=200)
	else:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)
