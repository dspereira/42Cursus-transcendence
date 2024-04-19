from django.db import models

# Create your models here.

class BallData:
	def __init__(self, x, y, dirX, dirY, radius, speed, maxSpeed):
		self.x = x
		self.y = y
		self.dirX = dirX
		self.dirY = dirY
		self.radius = radius
		self.speed = speed
		self.maxSpeed = maxSpeed
	def update(self, game):
		self.x, game.xPos
		self.y = game.yPos
		self.radius = game.radius
		self.speed = game.speed
		self.maxSpeed = game.maxSpeed
		self.speed = game.Speed
		self.dirX = game.dirX
		self.dirY = game.dirY

class PaddleData:
	def __init__(self, x, y, width, height, speed, maxSpeed):
		self.x = x
		self.y = y
		self.width = width
		self.height = height
		self.speed = speed
		self.maxSpeed = maxSpeed
	def update(self, game):
		self.x = game.x
		self.y = game.y
		self.width = game.width
		self.height = game.height
		self.speed = game.speed
		self.maxSpeed = game.maxSpeed

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


gData = GameData(800, 500, 10,\
				 10, 20, 5, 20, 0, 15,\
				 785, 20, 5, 20, 0 , 15,\
				 400, 250, 1, 0.75, 4, 4, 4)

rightInput = []
leftInput = []

# Actual game classes

class Paddle:
	def __init__(self, game, data):
		self.game = game
		self.x = data.x
		self.y = data.y
		self.width = data.width
		self.height = data.height
		self.speed = data.speed
		self.maxSpeed = data.maxSpeed
		# self.ySpeed = 0
		# self.maxSpeed = 15
	def update(self, keys):
		# self.speed = keys.vertical() * self.maxSpeed
		self.y += self.speed
		if (self.y < 0):
			self.y = 0
		elif (self.y > self.game.height - self.height):
			self.y = self.game.height - self.height
	def getPos(self):
		return [self.x, self.y]

class Ball:
	def __init__(self, game, data):
		self.game = data.game
		self.x = data.x
		self.y = data.y
		self.dirX = data.dirX
		self.dirY = data.dirY
		self.radius = data.radius
		# self.cSpeed = self.maxSpeed
		# self.speed = 0
		# self.maxSpeed = 4
		self.speed = data.speed
		self.maxSpeed = data.maxSpeed
	def update(self, leftPaddle, rightPaddle):
		if ((self.x + self.dirX + self.radius >= self.game.width) or (self.x + self.dirX - self.radius <= 0)):
			self.dirX *= -1
			self.x = self.game.width/2
			self.y = self.game.height/2
			self.speed = self.maxSpeed
		if (self.y + self.dirY + self.radius >= self.game.height or self.y + self.dirY - self.radius <= 0):
			self.dirY *= -1
		# if ((self.x >= leftPaddle.x &&
		# 	 self.x <= leftPaddle.x + leftPaddle.width)
		# 	&& (self.y + self.dirY >= leftPaddle.y && 
		# 	self.y + self.dirY <= leftPaddle.y - leftPaddle.height))
		# 	self.dirY *= -1

		# if (self.x <= leftPaddle.x && self.x)

		if (((self.y + self.radius >= leftPaddle.y and self.y - self.radius <= leftPaddle.y + leftPaddle.height)
			and self.x + self.dirX - self.radius <= leftPaddle.x + leftPaddle.width) or
			((self.y + self.radius >= rightPaddle.y and self.y - self.radius <= rightPaddle.y + rightPaddle.height)
			and self.x + self.dirX + self.radius >= rightPaddle.x)):
				self.dirX *= -1
				self.speed += 1
		self.x += self.dirX * self.speed
		self.y += self.dirY * self.speed

class GameEngine:
	def __init__(self, data):
		self.width = data.width
		self.height = data.height
		self.ball = Ball(self, data.ball)
		self.rightPaddle = Paddle(self, data.rightPaddle)
		self.leftPaddle = Paddle(self, data.leftPaddle)
	def update(self):
		print("game updating")
		# self.leftPaddle.update(leftInput)
		# self.rightPaddle.update(rightInput)
		self.ball.update(self.leftPaddle, self.rightPaddle)

# Create your models here. // DATABASE (tabelas linhas de c0c@ etc)z