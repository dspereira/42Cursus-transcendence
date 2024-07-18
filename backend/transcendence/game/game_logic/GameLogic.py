from .Paddle import Paddle
from .Ball import Ball

class GameLogic:
	def __init__(self):
		self.ball = Ball()
		self.paddle_left = Paddle()
		self.paddle_right = Paddle()

	def get_ball_positions(self):
		return self.ball.get_position()

	def update(self):
		self.ball.update_position()

	def get_paddle_left(self):
		return self.paddle_left.get_paddle_position()
	
	def get_paddle_right(self):
		return self.paddle_right.get_paddle_position()

	def update_paddle(self, key):
		self.paddle_left.update(key=key)
