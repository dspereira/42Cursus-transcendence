from .const_vars import *

class Paddle:
	def __init__(self, side):
		self.screen_height = SCREEN_HEIGHT
		self.screen_width = SCREEN_WIDTH
		self.height = 50
		self.width = 4
		self.wall_distance = 10
		self.half_height = self.height / 2
		self.half_width = self.width / 2
		self.step = 3
		self.side = side
		self.y = self.screen_height / 2
		self.x = self.__get_x(side)

	def get_position(self):
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

	def get_colision_point(self, old_ball_x, old_ball_y, new_ball_x, new_ball_y, ball_radius):
		x_colision = False
		y_colision = False
		if self.side == "left":
			x_colision = abs(new_ball_x - self.x) <= (ball_radius + self.half_width)
			y_colision = abs(new_ball_y - self.y) <= (ball_radius + self.half_height)
			new_x = self.x + ball_radius
		elif self.side == "right":
			x_colision = abs(self.x - new_ball_x) <= (ball_radius + self.half_width)
			y_colision = abs(self.y - new_ball_y) <= (ball_radius + self.half_height)
			new_x = self.x - ball_radius
		if x_colision and y_colision:
			m = (new_ball_y - old_ball_y) / (new_ball_x - old_ball_x)
			b = new_ball_y - m * new_ball_x
			new_y = m * new_x + b	
		else:
			return None
		hit_paddle_value = self.y - self.half_height - new_y
		hit_paddle_percentage = abs(hit_paddle_value * 100 / self.height)
		return {"x": new_x, "y": new_y, "hit_paddle_percentage": hit_paddle_percentage}

	def __get_x(self, side):
		if side == "left":
			return self.wall_distance + self.width
		return self.screen_width - self.wall_distance - self.width
