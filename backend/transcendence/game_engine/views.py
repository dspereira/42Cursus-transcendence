from django.http import JsonResponse
import json
from .game_logic.Game import Game
from user_auth.models import User
from .models import Match
from custom_utils.models_utils import ModelManager

game = Game()

match_model = ModelManager(Match)
user_model = ModelManager(User)

match_id = -1


requestTesting = {
	"player1_id": 1,
	"player2_id": 2,
	"score_player1": 4,
	"score_player2": 7,
	"game_id" : -1
}

POINT_LIMIT = 3


def create_match(request):

	if request:
		# req_data = json.loads(request.body)
		req_data = request
		player1 = user_model.get(id=req_data["player1_id"])
		player2 = user_model.get(id=req_data["player2_id"])
		new_match = match_model.create(user1=player1, user2=player2, user1_score=0, user2_score=0)
		response = {
			"message": "successfully added",
			"game_id": new_match.id
		}
	else:
		response = {
			"message": "failed to add"
		}
	return (response)

def	finish_match(request):

	if request:
		# req_data = json.loads(request.body)
		req_data = request
		match_by_id = match_model.get(id=req_data["game_id"])
		match_by_id.user1_score = req_data["score_player1"]
		match_by_id.user2_score = req_data["score_player2"]
		if match_by_id.user1_score >= 7:
			match_by_id.winner = match_by_id.user1
		elif match_by_id.user2_score >= 7:
			match_by_id.winner = match_by_id.user2
		match_by_id.save()
		response = {
			"message":"successfully refreshed"
		}
	else:
		response = {
			"message":"failed to refresh"
		}

	return (response)


def	player_controls(request) :

	data = json.loads(request.body.decode('utf-8')) # Parse JSON data from request body
	
	if (requestTesting["game_id"] == -1 and data.get("id") != "html"):
		requestTesting["game_id"] = create_match(requestTesting)["game_id"]
		print("")
		print("key:", data.get("key"))
		print("")


	game.update(data.get("keys"), data.get("player_id"))

	# if response_data["player2_score"] != game.get_state()["player2_score"]:
	# 	finish_match(requestTesting)

	response_data = game.get_state()

	if response_data["player2_score"] >= POINT_LIMIT or response_data["player1_score"] >= POINT_LIMIT :
		finish_match(requestTesting)

	return JsonResponse(response_data)
