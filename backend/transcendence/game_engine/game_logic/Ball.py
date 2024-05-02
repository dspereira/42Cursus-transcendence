import random
import time

class ballEngine:
	def __init__(self, Game_width, Game_height):

		self.x = 400
		self.y = 250
		self.x_dir = 1
		self.y_dir = 0.75
		self.radius = 4
		self.speed = 4
		self.start_speed = 4
		self.max_speed = 14
		self.game_width = Game_width
		self.game_height = Game_height
		self.last_call = int(round(time.time() * 1000))


	def update(self, Left_paddle, Right_paddle, score):

		self.left_paddle = Left_paddle
		self.right_paddle = Right_paddle
		self.time_now = int(round(time.time() * 1000))

		self._check_paddle_collision()
		self._check_border_collision(score)
		self._calculate_position(score)

		self.last_call = self.time_now
  

	def _check_paddle_collision(self):

		if (((self.y + self.radius >= self.left_paddle.y and self.y - self.radius <= self.left_paddle.y + self.left_paddle.height)
			and self.x + self.x_dir - self.radius <= self.left_paddle.x + self.left_paddle.width) or
			((self.y + self.radius >= self.right_paddle.y and self.y - self.radius <= self.right_paddle.y + self.right_paddle.height)
			and self.x + self.x_dir + self.radius >= self.right_paddle.x)):
				if (self.x < self.game_width / 2):
					target_paddle = self.left_paddle
					self.x = target_paddle.x + target_paddle.width + self.radius
				else:
					target_paddle = self.right_paddle
					self.x = self.right_paddle.x - self.radius
				self.x_dir *= -1
				if self.speed < self.max_speed:
					self.speed += 1
				if self.y >= (target_paddle.y + (target_paddle.height / 2)):
					self.y_dir = random.uniform(0.01,1)
				elif self.y < (target_paddle.y + (target_paddle.height / 2)):
					self.y_dir = random.uniform(-0.01, -1)


	def _check_border_collision(self, score):

		if ((self.x + self.x_dir + self.radius >= self.game_width) or (self.x + self.x_dir - self.radius <= 0)):
			if self.x + self.x_dir - self.radius <= 0:
				score[1] +=1
			if self.x + self.x_dir + self.radius >= self.game_width:
				score[0] +=1
			self.x_dir *= -1
			self.x = self.game_width / 2
			self.y = self.game_height / 2
			self.speed = self.start_speed
		if (self.y + self.y_dir + self.radius >= self.game_height or self.y + self.y_dir - self.radius <= 0):
			self.y_dir *= -1


	def _calculate_position(self, score):

		future_x = self.x
		future_y = self.y
		future_x += self.x_dir * (self.speed * ((self.time_now - self.last_call) / 20))
		future_y += self.y_dir * (self.speed * ((self.time_now - self.last_call) / 20))

		if future_y >= self.game_height or future_y <=0 :
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
			if (self.y > self.game_height or self.y < 0):
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
