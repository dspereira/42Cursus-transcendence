from django.http import JsonResponse
from game_engine.game_logic.Game import Game
from user_auth.models import User
from game_engine.models import Match
from custom_utils.models_utils import ModelManager

match_model = ModelManager(Match)
user_model = ModelManager(User)

POINT_LIMIT = 3

def	update_match(response_data, game_id):


	match_by_id = match_model.get(id=game_id)
	match_by_id.user1_score = response_data["player1_score"]
	match_by_id.user2_score = response_data["player2_score"]
	if match_by_id.user1_score >= POINT_LIMIT:
		match_by_id.winner = match_by_id.user1
	elif match_by_id.user2_score >= POINT_LIMIT:
		match_by_id.winner = match_by_id.user2
	match_by_id.save()
	response = {
		"message":"successfully refreshed"
	}

	return (response)

def get_player_id(keys, match_id, user, data):

	if data["id"] == -1:
		return -1
	if match_id.user2:
		if match_id.user1.id == user:
			return 0
		else:
			return 1
	else:
		if keys[0] == 'w' or keys[0] == 's':
			return 0
		else:
			return 1