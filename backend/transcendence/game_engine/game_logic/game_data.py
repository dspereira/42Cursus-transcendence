from .Paddle import Paddle 
from .Ball	import	ballEngine


class Game:
		def __init__(self):
			self.width = 800
			self.height = 500
			self.score = [0,0]
			self.ball = ballEngine(self.width, self.height)
			self.right_Paddle = Paddle(self.height, X=780)
			self.left_Paddle = Paddle(self.height, X=10)


		def update(self, keys, player_id):

			if player_id == 0:
				self.left_Paddle.update(keys)
			elif player_id == 1:
				self.right_Paddle.update(keys)
			elif player_id == -1:
				self.ball.update(self.left_Paddle, self.right_Paddle, self.score)
