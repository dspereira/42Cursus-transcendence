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
