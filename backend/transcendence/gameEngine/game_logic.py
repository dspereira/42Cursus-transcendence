# game logic goes in here!
from models import Ball, Paddle, GameEngine, GameData

gData = GameData(800, 500, 10,\
				 10, 20, 5, 20, 0, 15,\
				 785, 20, 5, 20, 0 , 15,\
				 400, 250, 1, 0.75, 4, 4, 4)

def update_game(data):
	game = GameEngine(gData)
	game.update(data.keys)
	gData.update(game)



def	getGame():
	#called to refresh user page, only returns the values needed to update the page
	pass