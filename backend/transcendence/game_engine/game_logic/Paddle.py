class Paddle:
	def __init__(self, Gameheight, X):
		self.gameHeight = Gameheight
		self.x = X
		self.y = 250
		self.width = 10
		self.height = 50
		self.speed = 0
		self.maxSpeed = 7

	def update(self, keys):

		self.speed = vertical(keys) * self.maxSpeed
		self.y += self.speed
		if self.y < 0:
			self.y = 0
		elif (self.y > self.gameHeight - self.height):
			self.y = self.gameHeight - self.height


def vertical(keys) :
	if keys[0]:
		if keys[0] == 'w' or keys[0] == 'ArrowUp':
			return -1
		if keys[0] == 's' or keys[0] == 'ArrowDown':
			return 1
	return 0