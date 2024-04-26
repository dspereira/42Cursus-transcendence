# game logic goes in here!
from .game_data import GameEngine, GameData

gData = GameData(width=800, height=500, paddlePadding=10,\
				 leftPaddleX=10, leftPaddleY=20, leftPaddleWidth=10, leftPaddleHeight=50, leftPaddleSpeed=0, leftPaddleMaxSpeed=15,\
				 rightPaddleX=780, rightPaddleY=20, rightPaddleWidth=10, rightPaddleHeight=50, rightPaddleSpeed=0 , rightPaddleMaxSpeed=15,\
				 ballX=400, ballY=250, ballDirX=1, ballDirY=0.75, ballRadius=4, ballSpeed=4, ballMaxSpeed=4, player1S=0, player2S=0)

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



def	getGame():
	#called to refresh user page, only returns the values needed to update the page
	pass


"""
	Changed game data from models to game_logic.game_data.py
	Game rules go here.
	Good practices:
		-If you wanna create classes, put them organized in different files\
		-If there are seperate functions that do not belong to a class:
			-organize them in different files by blocks of utility.
"""