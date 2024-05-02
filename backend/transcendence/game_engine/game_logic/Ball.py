import random
import time

class ballEngine:
	def __init__(self, Gamewidth, Gameheight):

		self.x = 400
		self.y = 250
		self.dirX = 1
		self.dirY = 0.75
		self.radius = 4
		self.speed = 4
		self.start_speed = 4
		self.gameWidth = Gamewidth
		self.gameHeight = Gameheight
		self.last_call = int(round(time.time() * 1000))

	def update(self, leftPaddle, rightPaddle, score):

		self.leftPaddle = leftPaddle
		self.rightPaddle = rightPaddle
		self.time_now = int(round(time.time() * 1000))

		self._check_paddle_collision()
		self._check_border_collision(score)
		self._calculate_position(score)

		self.last_call = self.time_now
  

	def _check_paddle_collision(self):

		if (((self.y + self.radius >= self.leftPaddle.y and self.y - self.radius <= self.leftPaddle.y + self.leftPaddle.height)
			and self.x + self.dirX - self.radius <= self.leftPaddle.x + self.leftPaddle.width) or
			((self.y + self.radius >= self.rightPaddle.y and self.y - self.radius <= self.rightPaddle.y + self.rightPaddle.height)
			and self.x + self.dirX + self.radius >= self.rightPaddle.x)):
				if (self.x < self.gameWidth / 2):
					targetPaddle = self.leftPaddle
					self.x = targetPaddle.x + targetPaddle.width + self.radius
				else:
					targetPaddle = self.rightPaddle
					self.x = self.rightPaddle.x - self.radius
				self.dirX *= -1
				if self.speed < 9:
					self.speed += 1
				if self.y >= (targetPaddle.y + (targetPaddle.height / 2)):
					self.dirY = random.uniform(0.01,1)
				elif self.y < (targetPaddle.y + (targetPaddle.height / 2)):
					self.dirY = random.uniform(-0.01, -1)


	def _check_border_collision(self, score):

		if ((self.x + self.dirX + self.radius >= self.gameWidth) or (self.x + self.dirX - self.radius <= 0)):
			if self.x + self.dirX - self.radius <= 0:
				score[1] +=1
			if self.x + self.dirX + self.radius >= self.gameWidth:
				score[0] +=1
			self.dirX *= -1
			self.x = self.gameWidth / 2
			self.y = self.gameHeight / 2
			self.speed = self.start_speed
		if (self.y + self.dirY + self.radius >= self.gameHeight or self.y + self.dirY - self.radius <= 0):
			self.dirY *= -1


	def _calculate_position(self, score):

		future_x = self.x
		future_y = self.y
		future_x += self.dirX * (self.speed * ((self.time_now - self.last_call) / 20))
		future_y += self.dirY * (self.speed * ((self.time_now - self.last_call) / 20))

		if future_y >= self.gameHeight or future_y <=0 :
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
			self.y += self.dirY * (self.speed / 20)
			time_divided -= 1
			if (self.y > self.gameHeight or self.y < 0):
				self.dirY *= -1
				break
		self.y += self.dirY * (self.speed/20) * time_divided
	

	def _correct_position_x(self, score):

		time_divided = ((self.time_now - self.last_call))

		while (time_divided > 0):
			self.x += self.dirX * (self.speed / 20)
			time_divided -= 1
			if (self.x <= 10 or self.x >= 780):
				self._check_paddle_collision()
				break
		self.x += self.dirX * (self.speed/20) * time_divided
		self._check_border_collision(score)
