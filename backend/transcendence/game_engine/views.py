from django.http import JsonResponse
import json
from .game_logic.Game import Game

game = Game()

def	player_controls(request) :
	data = json.loads(request.body.decode('utf-8')) # Parse JSON data from request body
	# print(data.get("keys"), "<- KEYS")
	
	game.update(data.get("keys"), data.get("player_id"))

	response_data = game.get_state()
	
	return JsonResponse(response_data)
