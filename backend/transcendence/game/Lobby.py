from custom_utils.models_utils import ModelManager
from game.models import Games
from .utils import GAME_STATUS_CREATED

game_model = ModelManager(Games)

class Lobby:
	def __init__(self, host_user_id):
		self.user_1 = host_user_id
		self.user_2 = 0
		self.ready_status_player_1 = False
		self.ready_status_player_2 = False
		self.user_1_connected = False
		self.user_2_connected = False
		self.associated_game = None
		self.game_id = None

	def set_user_2_id(self, user_2_id):
		self.user_2 = user_2_id

	def set_associated_game_id(self, associated_game_id):
		self.game_id = associated_game_id

	def get_user_2_id(self):
		return self.user_2

	def get_host_id(self):
		return self.user_1

	def get_associated_game_id(self):
		game_id = self.game_id
		if game_id:
			game = game_model.get(id=game_id)
			if game and game.tournament and game.status == GAME_STATUS_CREATED:
				game_id = None
		return game_id

	def update_ready_status(self, user_id):
		if user_id == self.user_1:
			self.ready_status_player_1 = self.__get_new_ready_status(self.ready_status_player_1)
		else:
			self.ready_status_player_2 = self.__get_new_ready_status(self.ready_status_player_2)

	def update_connected_status(self, user_id, status):
		if user_id == self.user_1:
			self.user_1_connected = status
		else:
			self.user_2_connected = status

	def is_ready_to_start(self):
		if self.ready_status_player_1 and self.ready_status_player_2:
			return True
		return False

	def has_access(self, user_id):
		if self.user_1 == user_id or self.user_2 == user_id:
			return True
		return False

	def is_user_connected(self, user_id):
		if user_id == self.user_1:
			return self.user_1_connected
		else:
			return self.user_2_connected

	def is_user_ready(self, user_id):
		if user_id == self.user_1:
			return self.ready_status_player_1
		else:
			return self.ready_status_player_2

	def is_only_host_online(self):
		if self.user_1_connected and not self.user_2_connected:
			return True
		return False

	def is_full(self):
		if self.user_1_connected and self.user_2_connected:
			return True
		return False

	def get_tournament_game(self):
		game_id = self.game_id
		game = None
		if game_id:
			game = game_model.get(id=game_id)
			if game and not game.tournament:
				game = None
		return game

	def is_tournament_game(self):
		game_id = self.game_id
		if game_id:
			game = game_model.get(id=game_id)
			if game and game.tournament:
				return True
		return False

	def __get_new_ready_status(self, current_status):
		new_status = True
		if current_status == True:
			new_status = False
		return new_status

	def reset(self):
		self.user_2 = 0
		self.ready_status_player_1 = False
		self.ready_status_player_2 = False
		self.user_1_connected = False
		self.user_2_connected = False
		self.associated_game = None
		self.game_id = None

	def __str__(self) -> str:
		res = "\n---------------------------------------------------\n"
		res += f"Host User  -> {self.user_1}\n"
		res += f"Other User -> {self.user_2}\n"
		res += f"Host User Connected  -> {self.user_1_connected}\n"
		res += f"Other User Connected -> {self.user_2_connected}\n"
		res += "---------------------------------------------------\n"
		return res

lobby_dict = {}
