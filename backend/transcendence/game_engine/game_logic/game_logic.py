from .game_data import Game

gData = Game()

def update_game(data):

	key_value = data.get("keys")  # Use .get() method to retrieve the value
	player_id = data.get("player_id")
	
	gData.update(key_value, player_id)

	return gData

"""
	Changed game data from models to game_logic.game_data.py
	Game rules go here.
	Good practices:
		-If you wanna create classes, put them organized in different files\
		
		-If there are seperate functions that do not belong to a class:
			-organize them in different files by blocks of utility.
"""