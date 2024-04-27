import math

ballDict = {
	"x_cord" : 400,
	"y_cord" : 250,
	"x_dir" : 1,
	"y_dir" : 0.75,
	"radius" : 4,
	"speed" : 4,
	"max_speed" : 4,
}

class Ball:
	def __init__(self, game, data): #
		self.game = game #data.game
		self.x = data["x_cord"]
		self.y = data["y_cord"]
		self.dirX = data["x_dir"]
		self.dirY = data["y_dir"]
		self.radius = data["radius"]
		self.speed = data["speed"]
		self.maxSpeed = data["max_speed"]
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


# class BallData:
# 	def __init__(self, x, y, dirX, dirY, radius, speed, maxSpeed):
# 		self.x = x
# 		self.y = y
# 		self.dirX = dirX
# 		self.dirY = dirY
# 		self.radius = radius
# 		self.speed = speed
# 		self.maxSpeed = maxSpeed
# 	def update(self, game):
# 		self.x = game.x
# 		self.y = game.y
# 		self.radius = game.radius
# 		self.speed = game.speed
# 		self.maxSpeed = game.maxSpeed
# 		self.dirX = game.dirX
# 		self.dirY = game.dirY


# gData = GameData(width=800, height=500, paddlePadding=10,\
# 				#  leftPaddleX=10, leftPaddleY=20, leftPaddleWidth=10, leftPaddleHeight=50, leftPaddleSpeed=0, leftPaddleMaxSpeed=15,\
# 				#  rightPaddleX=780, rightPaddleY=20, rightPaddleWidth=10, rightPaddleHeight=50, rightPaddleSpeed=0 , rightPaddleMaxSpeed=15,\
# 				#  ballX=400, ballY=250, ballDirX=1, ballDirY=0.75, ballRadius=4, ballSpeed=4, ballMaxSpeed=4, player1S=0, player2S=0)

