from .Ball import Ball

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 400

class GameLogic:
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.ball = Ball(screen_width=SCREEN_WIDTH, screen_heigth=SCREEN_HEIGHT)

	def get_ball_positions(self):
		return self.ball.get_position()

	def update(self):
		self.ball.update_position()
