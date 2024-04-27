from .Paddle import Paddle, PaddleData
from .Ball	import	Ball, ballDict

class GameData:
		def __init__(self, width, height, paddlePadding, \
			leftPaddleX, leftPaddleY, leftPaddleWidth, leftPaddleHeight, leftPaddleSpeed, leftPaddleMaxSpeed,\
			rightPaddleX, rightPaddleY, rightPaddleWidth, rightPaddleHeight, rightPaddleSpeed, rightPaddleMaxSpeed,\
			ballX, ballY, ballDirX, ballDirY, ballRadius, ballSpeed, ballMaxSpeed, player1S, player2S):
			self.width = width
			self.height = height
			self.player1Score = player1S
			self.player2Score = player2S
			self.paddlePadding = paddlePadding
			self.ball = ballDict
			# self.ball = BallData(ballX, ballY, ballDirX, ballDirY, ballRadius, ballSpeed, ballMaxSpeed)
			self.rightPaddle = PaddleData(rightPaddleX, rightPaddleY, rightPaddleWidth, rightPaddleHeight, rightPaddleSpeed, rightPaddleMaxSpeed)
			self.leftPaddle = PaddleData(leftPaddleX, leftPaddleY, leftPaddleWidth, leftPaddleHeight, leftPaddleSpeed, leftPaddleMaxSpeed)


		def update(self, game):
			self.width = game.width
			self.height = game.height
			self.player2Score = game.player2Score
			self.player1Score = game.player1Score
			self.__ball_update(game.ball, self.ball)
			self.leftPaddle.update(game.leftPaddle)
			self.rightPaddle.update(game.rightPaddle)


		def	__ball_update(self, game, ballDict):
			ballDict["x_cord"] = game.x
			ballDict["y_cord"] = game.y
			ballDict["radius"] = game.radius
			ballDict["speed"] = game.speed
			ballDict["max_speed"] = game.maxSpeed
			ballDict["x_dir"] = game.dirX
			ballDict["y_dir"] = game.dirY			

gData = GameData(width=800, height=500, paddlePadding=10,\
				 leftPaddleX=10, leftPaddleY=20, leftPaddleWidth=10, leftPaddleHeight=50, leftPaddleSpeed=0, leftPaddleMaxSpeed=15,\
				 rightPaddleX=780, rightPaddleY=20, rightPaddleWidth=10, rightPaddleHeight=50, rightPaddleSpeed=0 , rightPaddleMaxSpeed=15,\
				 ballX=400, ballY=250, ballDirX=1, ballDirY=0.75, ballRadius=4, ballSpeed=4, ballMaxSpeed=4, player1S=0, player2S=0)


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
		if player_id == -1 :
			self.ball.update(self.leftPaddle, self.rightPaddle, self)