from .Paddle import Paddle, paddleDict
from .Ball	import	Ball, ballDict
import time

class GameData:
		def __init__(self, width, height, paddlePadding, player1S, player2S):
			self.width = width
			self.height = height
			self.player1Score = player1S
			self.player2Score = player2S
			self.paddlePadding = paddlePadding
			self.ball = {**ballDict}
			self.ball["start_time"] = int(round(time.time() * 1000))
			# print("THIS IS GAME TALKING", self.ball["x_cord"])
			self.rightPaddle = {**paddleDict}
			self.rightPaddle["x_cord"] = 780
			self.leftPaddle = {**paddleDict}


		def update(self, game):
			self.width = game.width
			self.height = game.height
			self.player2Score = game.player2Score
			self.player1Score = game.player1Score
			# print("THIS IS GAME TALKING before update", self.ball["x_cord"])
			self.__ball_update(game.ball, self.ball)
			self.__paddle_update(game.leftPaddle, self.leftPaddle)
			self.__paddle_update(game.rightPaddle, self.rightPaddle)

		def __paddle_update(self, game, paddleDict):
			paddleDict["x_cord"] = game.x
			paddleDict["y_cord"] = game.y
			paddleDict["width"] = game.width
			paddleDict["height"] = game.height
			paddleDict["max_speed"] = game.maxSpeed
			paddleDict["speed"] = game.speed


		def	__ball_update(self, game, ballDict):
			self.ball["x_cord"] = game.x
			ballDict["y_cord"] = game.y
			ballDict["radius"] = game.radius
			ballDict["speed"] = game.speed
			ballDict["start_speed"] = game.start_speed
			ballDict["x_dir"] = game.dirX
			ballDict["y_dir"] = game.dirY
			ballDict["last_call"] = game.last_call

gData = GameData(width=800, height=500, paddlePadding=10,\
					player1S=0, player2S=0)


class GameEngine:
	def __init__(self, data):
		self.width = data.width
		self.height = data.height
		self.player2Score = data.player2Score
		self.player1Score = data.player1Score
		self.ball = Ball(self, data.ball)
		self.rightPaddle = Paddle(self, data.rightPaddle)
		self.leftPaddle = Paddle(self, data.leftPaddle)
	def update(self, keys, player_id):
		if keys :
			if player_id == 0:
				self.leftPaddle.update(keys)
			if player_id == 1:
				self.rightPaddle.update(keys)
		if player_id == -1:
			self.ball.update(self.leftPaddle, self.rightPaddle, self)