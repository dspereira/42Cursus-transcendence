from .Paddle import Paddle
from .Ball import Ball

class GameLogic:
	def __init__(self, user1_id, user2_id):
		self.ball = Ball()
		self.paddle_left = Paddle("left")
		self.paddle_right = Paddle("right")
		self.player_1_score = 0
		self.player_2_score = 0
		self.player_1 = user1_id
		self.player_2 = user2_id
		self.player_1_ready = False
		self.player_2_ready = False

	def get_ball_positions(self):
		return self.ball.get_position()

	def update(self):
		self.ball.update_position(self.paddle_left, self.paddle_right)
		goal_info = self.ball.goal_detection()
		if goal_info:
			self.__add_score(goal_info)
		self.paddle_left.update()
		self.paddle_right.update()

	def get_paddle_left(self):
		return self.paddle_left.get_position()

	def get_paddle_right(self):
		return self.paddle_right.get_position()

	def update_paddle(self, key, status, user_id):
		if user_id == self.player_1:
			self.paddle_left.set_state(key=key, status=status)
		elif user_id == self.player_2:
			self.paddle_right.set_state(key=key, status=status)

	def get_score_values(self):
		return {"player_1_score": self.player_1_score, "player_2_score": self.player_2_score}

	def is_end_game(self):
		if self.player_1_score == 7 or self.player_2_score == 7:
			self.ball.set_end_game_position()
			self.paddle_left.end_game_position()
			self.paddle_right.end_game_position()
			return True
		return False

	def set_player_ready(self, user_id):
		if user_id == self.player_1:
			self.player_1_ready = True
		elif user_id == self.player_2:
			self.player_2_ready = True

	def get_ready_to_start(self):
		if self.player_1_ready and self.player_2_ready:
			return True
		return False

	def __add_score(self, info):
		if info['player_1']:
			self.player_1_score += 1
		elif info['player_2']:
			self.player_2_score += 1
