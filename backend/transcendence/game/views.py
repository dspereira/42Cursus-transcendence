from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from django.http import JsonResponse
from user_auth.models import User
from .models import Games
import json

from .utils import has_already_valid_game_request
from .utils import GAME_STATUS_FINISHED

user_model = ModelManager(User)
game_model = ModelManager(Games)

CLASSIC_RETRO = {"background": "#000000", "paddle": "#FFFFFF", "ball": "#FFD700", "pontuation": "rgba(26, 26, 26, 0.8)", "middleLine": "#FFFFFF"}
MODERN_NEON = {"background": "#1A1A1A", "paddle": "#39FF14", "ball": "#FF1493", "pontuation": "rgba(0, 0, 0, 0.3)", "middleLine": "#39FF14"}
OCEAN_VIBES = {"background": "#002F4F", "paddle": "#007FFF", "ball": "#00BFFF", "pontuation": "rgba(173, 216, 230, 0.1)", "middleLine": "#00BFFF"}
SUNSET_GLOW = {"background": "#FF4500", "paddle": "#FFD700", "ball": "#FFD700", "pontuation": "rgba(255, 182, 193, 0.35)", "middleLine": "#FFD700"}
FOREST_RETREAT = {"background": "#013220", "paddle": "#7CFC00", "ball": "#32CD32", "pontuation": "rgba(152, 251, 152, 0.1)", "middleLine": "#32CD32"}

COLOR_PALLETS = [CLASSIC_RETRO, MODERN_NEON, OCEAN_VIBES, SUNSET_GLOW, FOREST_RETREAT]

@login_required
@accepted_methods(["GET"])
def color_pallet(request):
	if request.GET.get('id'):
		color_id = int(request.GET.get('id'))
		if color_id and color_id <= len(COLOR_PALLETS):
			return JsonResponse({"message": "Color Pallet Retrieved With Success", "color_pallet": COLOR_PALLETS[color_id - 1]}, status=200)	
	return JsonResponse({"message": "Error: Invalid color pallet id!"}, status=400)

@accepted_methods(["GET"])
def test(request):
	user = user_model.get(id=request.GET.get('user'))
	friend = user_model.get(id=request.GET.get('id'))

	if user and friend and user.id != friend.id:
		has_already_valid_game_request(user1=user, user2=friend)

	return JsonResponse({"message": "Test Message"}, status=200)

@accepted_methods(["POST"])
def set_game_score_info(request):
	if request.body:
		req_data = json.loads(request.body)
		game = game_model.get(id=req_data["id"])
		if not game:
			return JsonResponse({"message": "Error: Invalid game ID!"}, status=409)
		game.user1_score = req_data["user1_score"]
		game.user2_score = req_data["user2_score"]
		game.save()
		return JsonResponse({"message": "Scores updated with success!"}, status=200)
	else:
		return JsonResponse({"message": "Error: Empty Body!"}, status=400)

@accepted_methods(["POST"])
def set_game_as_finished(request):
	if request.body:
		req_data = json.loads(request.body)
		game = game_model.get(id=req_data["id"])
		if not game:
			return JsonResponse({"message": "Error: Invalid game ID!"}, status=409)
		if game.user1_score != game.user2_score:
			if game.user1_score > game.user2_score:
				game.winner = game.user1
			else:
				game.winner = game.user2
			game.status = GAME_STATUS_FINISHED
			game.save()
			return JsonResponse({"message": "Game is finished with success!"}, status=200)
		else:
			return JsonResponse({"message": "Error: Scores are iqual!"}, status=409)
	else:
		return JsonResponse({"message": "Error: Empty Body!"}, status=400)
