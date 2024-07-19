from datetime import datetime
from .const_vars import *
import random
import math

BALL_RADIUS = 5

class Ball:
	def __init__(self):
		self.screen_height = SCREEN_HEIGHT
		self.screen_width = SCREEN_WIDTH
		self.x_start = self.screen_width / 2
		self.y_start = self.screen_height / 2
		self.x = self.x_start
		self.y = self.y_start
		self.last_time = 0
		self.__set_start_angle()

		self.left_wall_limit = BALL_RADIUS
		self.right_wall_limit = self.screen_width - BALL_RADIUS
		self.top_wall_limit = BALL_RADIUS
		self.bottom_wall_limit = self.screen_height - BALL_RADIUS

	def get_position(self):
		position = {
			"x": self.x,
			"y": self.y
		}
		return position

	def update_position(self):
		radius = self.__get_radius()
		trig_values = self.__get_trig_values()
		x = self.x + radius * trig_values["cos_value"]
		y = self.y + radius * trig_values["sin_value"]

		colision_coords = self.__get_colision_point(x=x, y=y, angle_rad=math.radians(self.angle))

		if colision_coords:
			self.x = colision_coords['x']
			self.y = colision_coords['y']
			self.__set_new_reflection_angle()
		else:
			self.y = y
			self.x = x

	def goal_detection(self):
		player_1_goal = self.x >= self.right_wall_limit
		player_2_goal = self.x <= self.left_wall_limit 
		if player_1_goal or player_2_goal:
			goal_info = {
				"player_1": player_1_goal,
				"player_2": player_2_goal
			}
			self.x = self.x_start
			self.y = self.y_start
			self.__set_start_angle()
			return goal_info
		return None

	def set_end_game_position(self):
		self.x = self.x_start
		self.y = self.y_start

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

	def __get_trig_values(self):
		angle_rad = math.radians(self.angle)
		return {
			"sin_value": math.sin(angle_rad) * -1,
			"cos_value": math.cos(angle_rad)
		}

	# y = mx + b
	def __get_colision_point(self, x, y, angle_rad):
		if y > self.bottom_wall_limit:
			col_y = self.bottom_wall_limit
		elif y < self.top_wall_limit:
			col_y = BALL_RADIUS
		else:
			return None
		m = math.tan(angle_rad)
		b = self.y - m * self.x
		col_x = (col_y - b) / m
		return {"x": col_x, "y": col_y}

	def __set_new_reflection_angle(self):
		self.angle = 360 - self.angle

	def __set_start_angle(self):
		chosen_interval = random.choice(ANGLES_INTERVALS)
		self.angle = random.randint(chosen_interval[0], chosen_interval[1])
