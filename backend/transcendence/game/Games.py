from .game_logic.GameLogic import GameLogic

class Games():
	def __init__(self) -> None:
		self.games = {}

	def create_new_game(self, game_id, user1_id, user2_id):
		self.games[game_id] = GameLogic(user1_id, user2_id)

	def get_game_obj(self, game_id):
		if game_id in self.games:
			return self.games[game_id]
		return None

	def remove_game_obj(self, game_id):
		if game_id in self.games:
			del self.games[game_id]

	# Apenas para teste remover depois
	def get_games(self):
		return self.games

games_dict = Games()
