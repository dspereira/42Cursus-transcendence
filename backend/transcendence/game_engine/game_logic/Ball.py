import random
import time
from .constantes import CANVAS_HEIGHT, CANVAS_WIDTH, PADDLE_WIDTH, PADDLE_HEIGHT, BALL_MAX_SPEED, BALL_RADIUS, BALL_START_SPEED

class Ball:

	def __init__(self):

		self.x = 400
		self.y = 250
		self.x_dir = 1
		self.y_dir = 0.75
		self.speed = 4
		self.last_call = int(round(time.time() * 1000))


	def update(self, Left_paddle, Right_paddle, score: int, game_paused: int):

		self.left_paddle = Left_paddle
		self.right_paddle = Right_paddle
		self.time_now = int(round(time.time() * 1000))

		if game_paused == -1:
			self._check_paddle_collision()
			self._check_border_collision(score)
			self._calculate_position(score)

		self.last_call = self.time_now

	def unpause(self):
		self.time_now = int(round(time.time() * 1000))
		self.last_call = self.time_now

	def _check_paddle_collision(self):

		if (((self.y + BALL_RADIUS >= self.left_paddle.y and self.y - BALL_RADIUS <= self.left_paddle.y + PADDLE_HEIGHT)
			and self.x + self.x_dir - BALL_RADIUS <= self.left_paddle.x + PADDLE_WIDTH) or
			((self.y + BALL_RADIUS >= self.right_paddle.y and self.y - BALL_RADIUS <= self.right_paddle.y + PADDLE_HEIGHT)
			and self.x + self.x_dir + BALL_RADIUS >= self.right_paddle.x)):
				if (self.x < CANVAS_WIDTH / 2):
					target_paddle = self.left_paddle
					self.x = target_paddle.x + PADDLE_WIDTH + BALL_RADIUS
				else:
					target_paddle = self.right_paddle
					self.x = self.right_paddle.x - BALL_RADIUS
				self.x_dir *= -1
				if self.speed < BALL_MAX_SPEED:
					self.speed += 1
				if self.y >= (target_paddle.y + (PADDLE_HEIGHT / 2)):
					self.y_dir = random.uniform(0.01,1)
				elif self.y < (target_paddle.y + (PADDLE_HEIGHT / 2)):
					self.y_dir = random.uniform(-0.01, -1)


	def _check_border_collision(self, score):

		if ((self.x + self.x_dir + BALL_RADIUS >= CANVAS_WIDTH) or (self.x + self.x_dir - BALL_RADIUS <= 0)):
			if self.x + self.x_dir - BALL_RADIUS <= 0:
				score[1] +=1
			if self.x + self.x_dir + BALL_RADIUS >= CANVAS_WIDTH:
				score[0] +=1
			self.x_dir *= -1
			self.x = CANVAS_WIDTH / 2
			self.y = CANVAS_HEIGHT / 2
			self.speed = BALL_START_SPEED
		if (self.y + self.y_dir + BALL_RADIUS >= CANVAS_HEIGHT or self.y + self.y_dir - BALL_RADIUS <= 0):
			self.y_dir *= -1


	def _calculate_position(self, score):

		future_x = self.x
		future_y = self.y
		future_x += self.x_dir * (self.speed * ((self.time_now - self.last_call) / 20))
		future_y += self.y_dir * (self.speed * ((self.time_now - self.last_call) / 20))

		if future_y >= CANVAS_HEIGHT or future_y <=0 :
			self._correct_position_y()
		else:
			self.y = future_y
		if future_x >= 780 or future_x <= 10:
			self._correct_position_x(score)
		else:
			self.x = future_x


	def _correct_position_y(self):

		time_divided = ((self.time_now - self.last_call))

		while (time_divided > 0):
			self.y += self.y_dir * (self.speed / 20)
			time_divided -= 1
			if (self.y > CANVAS_HEIGHT or self.y < 0):
				self.y_dir *= -1
				break
		self.y += self.y_dir * (self.speed/20) * time_divided
	

	def _correct_position_x(self, score):

		time_divided = ((self.time_now - self.last_call))

		while (time_divided > 0):
			self.x += self.x_dir * (self.speed / 20)
			time_divided -= 1
			if (self.x <= 10 or self.x >= 780):
				self._check_paddle_collision()
				break
		self.x += self.x_dir * (self.speed/20) * time_divided
		self._check_border_collision(score)
