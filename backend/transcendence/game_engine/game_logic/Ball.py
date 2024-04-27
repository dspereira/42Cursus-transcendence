import math

class Ball:
	def __init__(self, game, data): #
		self.game = game #data.game
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
	def update(self, leftPaddle, rightPaddle, game):
		if ((self.x + self.dirX + self.radius >= self.game.width)):
			self.dirX *= -1
			self.x = self.game.width/2
			self.y = self.game.height/2
			self.speed = self.maxSpeed
			game.player1Score +=1
		if (self.x + self.dirX - self.radius <= 0) :
			game.player2Score +=1
			self.dirX *= -1
			self.x = self.game.width/2
			self.y = self.game.height/2
			self.speed = self.maxSpeed
		if (self.y + self.dirY + self.radius >= self.game.height or self.y + self.dirY - self.radius <= 0):
			self.dirY *= -1
		# self.PaddleCollision(leftPaddle)
		# self.PaddleCollision(rightPaddle)
		if (((self.y + self.radius >= leftPaddle.y and self.y - self.radius <= leftPaddle.y + leftPaddle.height)
			and self.x + self.dirX - self.radius <= leftPaddle.x + leftPaddle.width) or
			((self.y + self.radius >= rightPaddle.y and self.y - self.radius <= rightPaddle.y + rightPaddle.height)
			and self.x + self.dirX + self.radius >= rightPaddle.x)):
				if (self.x < game.width/2):
					self.x = leftPaddle.x + leftPaddle.width + self.radius
				else:
					self.x = rightPaddle.x - self.radius
				self.dirX *= -1
				self.speed += 1
		self.x += self.dirX * self.speed
		self.y += self.dirY * self.speed

	# def PaddleCollision(self, paddle):
	# 	colTestX = self.x
	# 	colTestY = self.y
	# 	print("paddleCoords", paddle.x, paddle.y, " Width ", paddle.width, " Height", paddle.height)
	# 	if (colTestX < self.x):
	# 		colTestX = paddle.x
	# 	elif (colTestX > paddle.x + paddle.width):
	# 		colTestX = paddle.x + paddle.width
	# 	else:
	# 		return
	# 	if (colTestY < paddle.y):
	# 		colTestY = paddle.y
	# 	elif (colTestY > paddle.y + paddle.height):
	# 		colTestY = paddle.y + paddle.height
	# 	else:
	# 		return
	# 	distX = self.x - colTestX
	# 	distY = self.y - colTestY
	# 	if (math.sqrt((distX * distX)+ (distY * distY)) <= self.radius):
	# 		if ((self.y <= paddle.y and self.dirY > 0) or (self.y >= paddle.y + paddle.height and self.dirY < 0)):
	# 			self.dirY *= -1
	# 		else:
	# 			self.dirX *= -1


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
		self.x = game.x
		self.y = game.y
		self.radius = game.radius
		self.speed = game.speed
		self.maxSpeed = game.maxSpeed
		self.dirX = game.dirX
		self.dirY = game.dirY

