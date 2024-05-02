class Paddle:

	def __init__(self, Game_height, X):
	
		self.game_height = Game_height
		self.x = X
		self.width = 10
		self.y = 250
		self.height = 50
		self.speed = 0
		self.max_speed = 7

	def update(self, keys):

		self.speed = vertical(keys) * self.max_speed
		self.y += self.speed
		if self.y < 0:
			self.y = 0
		elif (self.y > self.game_height - self.height):
			self.y = self.game_height - self.height


def vertical(keys) :
	
	if keys[0]:
		if keys[0] == 'w' or keys[0] == 'ArrowUp':
			return -1
		if keys[0] == 's' or keys[0] == 'ArrowDown':
			return 1
	return 0