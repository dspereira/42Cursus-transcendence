from .Paddle import Paddle 
from .Ball	import	ballEngine


class Game:
		def __init__(self):
			print("hello from the other side... i've come to see you again")
			self.width = 800
			self.height = 500
			self.paddlePadding = 10
			self.score = [0,0]
			self.ball = ballEngine(self.width, self.height)
			self.rightPaddle = Paddle(self.height, 780)
			self.leftPaddle = Paddle(self.height, 10)


		def update(self, keys, player_id):

			if player_id == 0:
				self.leftPaddle.update(keys)
			elif player_id == 1:
				self.rightPaddle.update(keys)
			elif player_id == -1:
				self.ball.update(self.leftPaddle, self.rightPaddle, self.score)
