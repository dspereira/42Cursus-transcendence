# game logic goes in here!
from .game_data import GameEngine, GameData

gData = GameData(width=800, height=500, paddlePadding=10,\
					player1S=0, player2S=0)

def update_game(data):
	game = GameEngine(gData)

	key_value = data.get("keys")  # Use .get() method to retrieve the value
	player_id = data.get("player_id")

	game.update(key_value, player_id)
	gData.update(game)

	return gData



"""
	Changed game data from models to game_logic.game_data.py
	Game rules go here.
	Good practices:
		-If you wanna create classes, put them organized in different files\
		-If there are seperate functions that do not belong to a class:
			-organize them in different files by blocks of utility.
"""