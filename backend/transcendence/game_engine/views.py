from django.http import JsonResponse
import json
import time
from .game_logic.Game import Game
from user_auth.models import User
from .models import Match
from custom_utils.models_utils import ModelManager

game = Game()

match_model = ModelManager(Match)
user_model = ModelManager(User)

match_id = -1

pause_status = -1

requestTesting = {
	"player1_id": 1,
	"player2_id": 2,
	"score_player1": 0,
	"score_player2": 0,
	"game_id" : -1,
	"pause_status" : -1
}

POINT_LIMIT = 3

# def start_game(request):
	

def	pause_game(request):
	# print("")
	if request:
		data = json.loads(request.body.decode('utf-8')) # Parse JSON data from request body
		requestTesting["pause_status"] = data.get("pause")
		response = {
			"message": "successfully paused",
		}
	else:
		response = {
			"message": "failed to pause"
		}
	return JsonResponse(response)


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
	return response

def	update_match(request):

	if request:
		# req_data = json.loads(request.body)
		req_data = request
		match_by_id = match_model.get(id=req_data["game_id"])
		match_by_id.user1_score = req_data["score_player1"]
		match_by_id.user2_score = req_data["score_player2"]
		if match_by_id.user1_score >= POINT_LIMIT:
			match_by_id.winner = match_by_id.user1
		elif match_by_id.user2_score >= POINT_LIMIT:
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

	# if requestTesting["pause_status"] == -1:
	if (requestTesting["game_id"] == -1 and data.get("id") != "html"):
		requestTesting["game_id"] = create_match(requestTesting)["game_id"]
		print("")
		print("player_id:", data.get("player_id"), "game_id:", requestTesting["game_id"])
		print("")


	game.update(data.get("keys"), data.get("player_id"), requestTesting["pause_status"])

	response_data = game.get_state()

	if response_data["player2_score"] != requestTesting["score_player2"] or response_data["player1_score"] != requestTesting["score_player1"] :
		update_match(requestTesting)

	requestTesting["score_player1"] = response_data["player1_score"]
	requestTesting["score_player2"] = response_data["player2_score"]


	return JsonResponse(response_data)
