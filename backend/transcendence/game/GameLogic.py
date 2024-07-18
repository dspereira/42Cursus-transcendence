from .Ball import Ball

SCREEN_WIDTH = 800
SCREEN_HEIGHT = 400

class GameLogic:
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.ball = Ball(screen_width=SCREEN_HEIGHT, screen_heigth=SCREEN_HEIGHT)

	def get_ball_positions(self):
		return self.ball.get_position()

	def get_degrees(self, angle_deg):
		print()
		print(f"Angle: {angle_deg}")
		print(f"Valores de COS e SIN\n{self.ball.get_direction(angle_deg=angle_deg)}")
		print()
		# return self.ball.get_direction(angle_deg=angle_deg)
