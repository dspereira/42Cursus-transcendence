class Ball:
	def __init__(self, screen_width, screen_heigth):
		self.screen_height = screen_heigth
		self.screen_width = screen_width
		self.x = self.screen_width / 2
		self.y = self.screen_height / 2

	def get_position(self):
		position = {
			"x": self.x,
			"y": self.y
		}
		return position

	"""
		COS neg -> 90 a 270 
		SIN neg -> 180 a 360
	"""
	def get_direction(self, angle_deg):
		sin_value_mult = 1
		cos_value_mult = 1

		if angle_deg > 90 and angle_deg < 270:
			cos_value_mult = -1
		if angle_deg > 180 and angle_deg < 360:
			sin_value_mult = -1

		return {
			"cos_value_mult": cos_value_mult,
			"sin_value_mult": sin_value_mult
		}
