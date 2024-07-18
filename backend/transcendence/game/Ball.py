from datetime import datetime
import math

NBR_PIXEL = 1
NBR_MS = 10

# pixel / ms
BALL_SPEED = NBR_PIXEL / NBR_MS

class Ball:
	def __init__(self, screen_width, screen_heigth):
		self.screen_height = screen_heigth
		self.screen_width = screen_width
		self.x = self.screen_width / 2
		self.y = self.screen_height / 2
		self.last_time = 0

	def get_position(self):
		position = {
			"x": self.x,
			"y": self.y
		}
		return position

	def update_position(self):
		angle = 190

		radius = self.__get_radius()
		trig_values = self.__get_trig_values(angle_deg=angle)
		self.x += radius * trig_values["cos_value"]
		self.y += radius * trig_values["sin_value"]

	def __get_radius(self):
		if not self.last_time:
			self.last_time = datetime.now()
			value = 1
		else:
			current_time = datetime.now()
			value = (current_time.timestamp() - self.last_time.timestamp()) * 1000
			self.last_time = current_time
		radius = value * BALL_SPEED
		return radius

	def __get_trig_values(self, angle_deg):
		angle_rad = math.radians(angle_deg)
		return {
			"sin_value": math.sin(angle_rad) * -1,
			"cos_value": math.cos(angle_rad)
		}
