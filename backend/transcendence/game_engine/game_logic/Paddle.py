paddleDict = {
	"x_cord" : 10,
	"y_cord" : 250,
	"width" : 10,
	"height" : 50,
	"speed" : 0,
	"max_speed" : 7,
}

class Paddle:

	def __init__(self, game, paddleData):
		self.game = game
		self.x = paddleData["x_cord"]
		self.y = paddleData["y_cord"]
		self.width = paddleData["width"]
		self.height = paddleData["height"]
		self.speed = paddleData["speed"]
		self.maxSpeed = paddleData["max_speed"]

	def update(self, keys):
		self.speed = vertical(keys) * self.maxSpeed
		self.y += self.speed
		if (self.y < 0):
			self.y = 0
		elif (self.y > self.game.height - self.height):
			self.y = self.game.height - self.height
		# print(self.y)

	def getPos(self):
		return [self.x, self.y]



# class PaddlepaddleData:

# 	def __init__(self, x, y, width, height, speed, maxSpeed):
# 		self.x = x
# 		self.y = y
# 		self.width = width
# 		self.height = height
# 		self.speed = speed
# 		self.maxSpeed = maxSpeed

# 	def update(self, game):
# 		self.x = game.x
# 		self.y = game.y
# 		self.width = game.width
# 		self.height = game.height
# 		self.speed = game.speed
# 		self.maxSpeed = game.maxSpeed


def vertical(keys) :
	if keys[0]:
		if (keys[0] == 'w' or keys[0] == 'ArrowUp'):
			return -1
		if keys[0] == 's' or keys[0] == 'ArrowDown' :
			return 1
	return 0