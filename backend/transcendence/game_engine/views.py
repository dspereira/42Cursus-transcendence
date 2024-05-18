from django.http import JsonResponse
import json
import time
from .game_logic.Game import Game
from user_auth.models import User
from .models import Match
from custom_utils.models_utils import ModelManager
from .views_utils.views_utils import update_match
from custom_decorators.accepted_methods import accepted_methods
from custom_decorators.login_required import login_required
# from .views_utils.custom_decorator import check_match

game_map = {}

match_model = ModelManager(Match)
user_model = ModelManager(User)

def check_match(func):
	def wrapper(request, *args, **kwargs):
		if request.body:
			if request.access_data:
				user = user_model.get(id=request.access_data.sub)
				req_data = json.loads(request.body.decode("utf-8"))
				game_id = req_data["game_id"]
				try:
					game_id_int = int(game_id)
				except ValueError:
					return JsonResponse({"message": "Invalid game id"})
				match_id = match_model.get(id=game_id_int)
				if not match_id:
					return JsonResponse({"message": "There is no game with that id"})
				if match_id.user1 != user and match_id.user2 != user:
					return JsonResponse({"message": "you are not in that match"})
				return func(request, *args, **kwargs)
		return JsonResponse({"message": "Unauthorized. Invalid request"}, status=401)
	return wrapper



@accepted_methods(["POST"])
@login_required
@check_match
def	pause_game(request):

	data = json.loads(request.body.decode('utf-8')) # Parse JSON data from request body
	game_id_int = int( data["game_id"])

	game_map[game_id_int].pause()
	response = {
		"message": "successfully paused",
	}
	return JsonResponse(response)


@accepted_methods(["POST"])
@login_required
@check_match
def	game_update(request):

	data = json.loads(request.body.decode('utf-8')) # Parse JSON data from request body
	game_id_int = int( data["game_id"])
	match_id = match_model.get(id=game_id_int)

	game_map[game_id_int].update(None, -1)
	
	response_data = game_map[game_id_int].get_state()

	if response_data["player2_score"] != match_id.user2_score or response_data["player1_score"] != match_id.user1_score :
		update_match(response_data, game_id_int)

	return JsonResponse(response_data)


@accepted_methods(["POST"])
@login_required
@check_match
def	player_controls(request):

	data = json.loads(request.body.decode('utf-8')) # Parse JSON data from request body
	game_id_int = int( data["game_id"])
	match_id = match_model.get(id=data["game_id"])
	if match_id.user1 == request.access_data.sub:
		player_id = 0
	else:
		player_id = 1

	game_map[game_id_int].update(data.get("keys"), player_id)
	if game_id_int in game_map:

		response_data = game_map[game_id_int].get_state()
	else:
		response_data ={"message":"smth went wrong"}

	return JsonResponse(response_data)


@accepted_methods(["POST"])
@login_required
def create_match(request):

	if request.body:
		data = json.loads(request.body.decode('utf-8')) # Parse JSON data from request body
		player1 = user_model.get(id=request.access_data.sub)
		invitee = user_model.get(id=data["invitee"])
		new_match = match_model.create(user1=player1, user2=invitee, user1_score=0, user2_score=0)
		game_map[new_match.id] = Game()
		print(game_map[new_match.id].get_state())
		print(f"New game added. game_map keys: {list(game_map.keys())}")

		response = {
			"message": "successfully added",
			"game_id": new_match.id
		}
	else:
		response={"message":"error"}
	return JsonResponse(response)


@accepted_methods(["POST"])
@login_required
@check_match
def check_id(request):
	return JsonResponse({"message":"Valid id"})