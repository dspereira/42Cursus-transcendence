from .const_vars import *

class Paddle:
	def __init__(self):
		self.screen_height = SCREEN_HEIGHT
		self.screen_width = SCREEN_WIDTH
		self.height = 50
		self.half_height = self.height / 2
		self.step = 3
		self.y = self.screen_height / 2

	def get_paddle_position(self):
		return self.y - self.half_height

	def update(self, key):
		if key == "up":
			self.y -= self.step
		else:
			self.y += self.step
		if self.y > self.screen_height - self.half_height:			
			self.y = self.screen_height - self.half_height
		elif self.y < self.half_height:
			self.y = self.half_height
