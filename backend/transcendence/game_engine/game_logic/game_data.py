from .Paddle import Paddle, PaddleData
from .Ball	import	Ball, BallData

class GameData:
		def __init__(self, width, height, paddlePadding, \
			leftPaddleX, leftPaddleY, leftPaddleWidth, leftPaddleHeight, leftPaddleSpeed, leftPaddleMaxSpeed,\
			rightPaddleX, rightPaddleY, rightPaddleWidth, rightPaddleHeight, rightPaddleSpeed, rightPaddleMaxSpeed,\
			ballX, ballY, ballDirX, ballDirY, ballRadius, ballSpeed, ballMaxSpeed):
			self.width = width
			self.height = height
			self.paddlePadding = paddlePadding
			self.ball = BallData(ballX, ballY, ballDirX, ballDirY, ballRadius, ballSpeed, ballMaxSpeed)
			self.rightPaddle = PaddleData(rightPaddleX, rightPaddleY, rightPaddleWidth, rightPaddleHeight, rightPaddleSpeed, rightPaddleMaxSpeed)
			self.leftPaddle = PaddleData(leftPaddleX, leftPaddleY, leftPaddleWidth, leftPaddleHeight, leftPaddleSpeed, leftPaddleMaxSpeed)
		def update(self, game):
			self.width = game.width
			self.height = game.height
			self.ball.update(game.ball)
			self.leftPaddle.update(game.leftPaddle)
			self.rightPaddle.update(game.rightPaddle)


gData = GameData(width=800, height=500, paddlePadding=10,\
				 leftPaddleX=10, leftPaddleY=20, leftPaddleWidth=5, leftPaddleHeight=20, leftPaddleSpeed=0, leftPaddleMaxSpeed=15,\
				 rightPaddleX=785, rightPaddleY=20, rightPaddleWidth=5, rightPaddleHeight=20, rightPaddleSpeed=0 , rightPaddleMaxSpeed=15,\
				 ballX=400, ballY=250, ballDirX=1, ballDirY=0.75, ballRadius=4, ballSpeed=4, ballMaxSpeed=4)

rightInput = ['ArrowDown', 'ArrowUp']
leftInput = ['w', 's']

class GameEngine:
	def __init__(self, data):
		self.width = data.width
		self.height = data.height
		self.ball = Ball(self, data.ball)
		self.rightPaddle = Paddle(self, data.rightPaddle)
		self.leftPaddle = Paddle(self, data.leftPaddle)
	def update(self, keys, player_id):
		if player_id == 0:
			self.leftPaddle.update(keys)
		if player_id == 1:
			self.rightPaddle.update(keys)
		self.ball.update(self.leftPaddle, self.rightPaddle)