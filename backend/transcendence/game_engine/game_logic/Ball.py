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

