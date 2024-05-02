import random
import time

ballDict = {
	"x_cord" : 400,
	"y_cord" : 250,
	"x_dir" : 1,
	"y_dir" : 0.75,
	"radius" : 4,
	"speed" : 4,
	"start_speed" : 4,
	"last_call" : 0,
}


class Ball:
	def __init__(self, game, data): #

		self.game = game #data.game
		self.x = data["x_cord"]
		self.y = data["y_cord"]
		self.dirX = data["x_dir"]
		self.dirY = data["y_dir"]
		self.radius = data["radius"]
		self.speed = data["speed"]
		self.start_speed = data["start_speed"]
		self.last_call = data["last_call"]


	def update(self, leftPaddle, rightPaddle, game):

		self.leftPaddle = leftPaddle
		self.rightPaddle = rightPaddle
		self.time_now = int(round(time.time() * 1000))

		self._check_paddle_collision()
		self._check_border_collision(game)
		self._calculate_position(game)

		self.last_call = self.time_now
  

	def _check_paddle_collision(self):

		if (((self.y + self.radius >= self.leftPaddle.y and self.y - self.radius <= self.leftPaddle.y + self.leftPaddle.height)
			and self.x + self.dirX - self.radius <= self.leftPaddle.x + self.leftPaddle.width) or
			((self.y + self.radius >= self.rightPaddle.y and self.y - self.radius <= self.rightPaddle.y + self.rightPaddle.height)
			and self.x + self.dirX + self.radius >= self.rightPaddle.x)):
				if (self.x < self.game.width/2):
					targetPaddle = self.leftPaddle
					self.x = targetPaddle.x + targetPaddle.width + self.radius
				else:
					targetPaddle = self.rightPaddle
					self.x = self.rightPaddle.x - self.radius
				self.dirX *= -1
				if self.speed < 9:
					self.speed += 1
				if self.y >= (targetPaddle.y +25):
					self.dirY = random.uniform(0.1,1)
				elif self.y < (targetPaddle.y + 25):
					self.dirY = random.uniform(-0.1, -1)


	def _check_border_collision(self, game):

		if ((self.x + self.dirX + self.radius >= self.game.width) or (self.x + self.dirX - self.radius <= 0)):
			if self.x + self.dirX - self.radius <= 0:
				game.player2Score +=1
			if self.x + self.dirX + self.radius >= self.game.width:
				game.player1Score +=1
			self.dirX *= -1
			self.x = self.game.width/2
			self.y = self.game.height/2
			self.speed = self.start_speed
		if (self.y + self.dirY + self.radius >= self.game.height or self.y + self.dirY - self.radius <= 0):
			self.dirY *= -1


	def _calculate_position(self, game):

		future_x = self.x
		future_y = self.y
		future_x += self.dirX * (self.speed * ((self.time_now - self.last_call) / 20))
		future_y += self.dirY * (self.speed * ((self.time_now - self.last_call) / 20))

		if future_y >= self.game.height or future_y <=0 :
			self._correct_position_y()
		else:
			self.y = future_y
		if future_x >= 780 or future_x <= 10:
			self._correct_position_x(game)
		else:
			self.x = future_x


	def _correct_position_y(self):

		time_divided = ((self.time_now - self.last_call))
		print("===========================================")
		print("future Y:", self.dirY * (self.speed/20) * time_divided)
		while (time_divided > 0):
			self.y += self.dirY * (self.speed / 20)
			time_divided -= 1
			if (self.y > self.game.height or self.y < 0):
				self.dirY *= -1
				break
		self.y += self.dirY * (self.speed/20) * time_divided
		print("after changing:", self.y)
		print("===========================================")
	

	def _correct_position_x(self, game):

		time_divided = ((self.time_now - self.last_call))
		print("===========================================")
		print("X:", self.x)
		while (time_divided > 0):
			self.x += self.dirX * (self.speed / 20)
			time_divided -= 1
			if (self.x <= 10 or self.x >= 780):
				self._check_paddle_collision()
				break
		self.x += self.dirX * (self.speed/20) * time_divided
		print("after changing:", self.x)
		print("===========================================")
		self._check_border_collision(game)
