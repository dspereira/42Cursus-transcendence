rightInput = ['ArrowUp', 'ArrowDown']
leftInput = ['w', 's']

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
		print("vertical =", vertical(keys))
		self.speed = vertical(keys) * self.maxSpeed
		print("+++++++++")
		print(self.speed)
		print("+++++++++")
		self.y += self.speed
		if (self.y < 0):
			self.y = 0
		elif (self.y > self.game.height - self.height):
			self.y = self.game.height - self.height
		print(self.y)
	def getPos(self):
		return [self.x, self.y]
	
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

def vertical(keys) :
	if keys[0]:
		if (leftInput[0] == keys[0] or rightInput[0] == keys[0]):
			return -1
		if leftInput[1] == keys[0] or rightInput[1] == keys[0] :
			return 1
	return 0