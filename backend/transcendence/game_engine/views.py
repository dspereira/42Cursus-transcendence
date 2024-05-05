from django.http import JsonResponse
import json
from .game_logic.Game import Game
from user_auth.models import User
from .models import Match
from custom_utils.models_utils import ModelManager

game = Game()

match_db = ModelManager(Match)
user_db = ModelManager(User)


# request = {
# 	"player1_id": 1,
# 	"player2_id": 2,
# 	"score_player1": 4,
# 	"score_player2": 7,
# }


def	update_DB(request):
	if request.body:
		req_data = json.loads(request.body)
		player1 = user_db.get(id=req_data["player1_id"])
		player2 = user_db.get(id=req_data["player2_id"])
		if req_data["score_player1"] == 7:
			match_db.create(user1=player1, user2=player2, user1_score=req_data["score_player1"], user2_score=req_data["score_player2"], winner=req_data["player1_id"])
		else:
			match_db.create(user1=player1, user2=player2, user1_score=req_data["score_player1"], user2_score=req_data["score_player2"], winner=req_data["player2_id"])
		match_db.save()
	else:
		pass


def	player_controls(request) :
	data = json.loads(request.body.decode('utf-8')) # Parse JSON data from request body

	game.update(data.get("keys"), data.get("player_id"))

	response_data = game.get_state()

	return JsonResponse(response_data)
