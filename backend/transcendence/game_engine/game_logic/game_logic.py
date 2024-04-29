# game logic goes in here!
from .game_data import GameEngine, GameData

gData = GameData(width=800, height=500, paddlePadding=10,\
					player1S=0, player2S=0)

def update_game(data):
	game = GameEngine(gData)
	# print("-----update_game-----")
	# print(data)
	key_value = data.get("keys")  # Use .get() method to retrieve the value
	player_id = data.get("player_id")
	if key_value:
		print("Key value sent by frontend:", key_value, player_id)
	
	
	# print("-----------------")
	game.update(key_value, player_id)
	# print("player id =", player_id)
	gData.update(game)
	# print(gData.leftPaddle.y, "left Paddle y")
	return gData



"""
	Changed game data from models to game_logic.game_data.py
	Game rules go here.
	Good practices:
		-If you wanna create classes, put them organized in different files\
		-If there are seperate functions that do not belong to a class:
			-organize them in different files by blocks of utility.
"""