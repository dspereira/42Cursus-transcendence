from .Paddle import Paddle
from .Ball import Ball

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 400

class GameLogic:
	def __init__(self, *args, **kwargs):
		self.ball = Ball(screen_width=SCREEN_WIDTH, screen_heigth=SCREEN_HEIGHT)
		self.paddle_left = Paddle(screen_width=SCREEN_WIDTH, screen_heigth=SCREEN_HEIGHT)
		self.paddle_right = Paddle(screen_width=SCREEN_WIDTH, screen_heigth=SCREEN_HEIGHT)

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
