from .logic_utils import get_position_percentage
from datetime import datetime
from .const_vars import *
import random
import math

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
		positions = {
			"x": get_position_percentage(self.x, SCREEN_WIDTH),
			"y": get_position_percentage(self.y, SCREEN_HEIGHT)
		}
		return positions

	def update_position(self, left_paddle, right_paddle):
		radius = self.__get_moved_distance()
		x = self.x + radius * self.trig_values["cos_value"]
		y = self.y + radius * self.trig_values["sin_value"]

		colision_coords = self.__get_colision_point(y)
		paddle_colisions_coords = self.__get_paddle_colisions_coords(x, y, left_paddle, right_paddle)

		if colision_coords:
			self.x = colision_coords['x']
			self.y = colision_coords['y']
			self.__set_new_reflection_angle()
		elif paddle_colisions_coords:
			self.x = paddle_colisions_coords['x']
			self.y = paddle_colisions_coords['y']
			self.__set_new_paddle_angle(paddle_colisions_coords['hit_paddle_percentage'])
		else:
			self.x = x
			self.y = y

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

	def __get_moved_distance(self):
		if not self.last_time:
			self.last_time = datetime.now()
			value = 1
		else:
			current_time = datetime.now()
			value = (current_time.timestamp() - self.last_time.timestamp()) * 1000
			self.last_time = current_time
		radius = value * BALL_SPEED
		return radius

	def __set_trig_values(self, angle_rad):
		self.trig_values = {
			"sin_value": math.sin(angle_rad) * -1,
			"cos_value": math.cos(angle_rad)
		}

	def __get_colision_point(self, y):
		if y > self.bottom_wall_limit:
			col_y = self.bottom_wall_limit
		elif y < self.top_wall_limit:
			col_y = BALL_RADIUS
		else:
			return None
		m = math.tan(self.angle_rad)
		b = self.y - m * self.x
		col_x = (col_y - b) / m
		return {"x": col_x, "y": col_y}

	def __set_new_reflection_angle(self):
		self.__set_angle(360 - self.angle_deg)

	def __set_start_angle(self):
		self.__set_angle(self.__get_start_angle())

	def __set_angle(self, angle_deg):
		if angle_deg < 0:
			angle_deg += 360
		elif angle_deg > 360:
			angle_deg -= 360
		self.angle_deg = angle_deg
		self.angle_rad = math.radians(angle_deg)
		self.__set_trig_values(self.angle_rad)

	def __get_paddle_colisions_coords(self, x, y, left_paddle, right_paddle):
		if self.angle_deg > 90 and self.angle_deg < 270:
			new_coords = left_paddle.get_colision_point(self.x, self.y, x, y, BALL_RADIUS)
		else:
			new_coords = right_paddle.get_colision_point(self.x, self.y, x, y, BALL_RADIUS)
		return new_coords

	def __set_new_paddle_angle(self, hit_percentage):
		if self.angle_deg > 90 and self.angle_deg < 270:
			result_angle = 420 + (hit_percentage/100) * (300 - 420)
		else:
			result_angle = 120 + (hit_percentage/100) * (240 - 120)
		self.__set_angle(result_angle)

	def __get_start_angle(self):
		chosen_interval = random.choice(ANGLES_INTERVALS)
		start_angle = 180
		while start_angle == 180 or start_angle == 360:
			start_angle = random.randint(chosen_interval[0], chosen_interval[1])
		return start_angle
