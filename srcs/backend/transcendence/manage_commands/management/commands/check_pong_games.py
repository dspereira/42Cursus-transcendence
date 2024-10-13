from django.core.management.base import BaseCommand
from custom_utils.models_utils import ModelManager
from game.models import Games
from game.utils import GAME_STATUS_CREATED, GAME_STATUS_PLAYING
from django.db.models import Q

class Command(BaseCommand):
	help = 'Reset all users online status.'

	def handle(self, *args, **kwargs):
		self.games_model = ModelManager(Games)
		self.__delete_single_games()
		self.__reset_tournament_games()

	def __delete_single_games(self):
		single_games = self.games_model.filter(tournament__isnull=True, status__in=[GAME_STATUS_CREATED, GAME_STATUS_PLAYING])
		if single_games:
			single_games.delete()
			self.stdout.write(self.style.SUCCESS("All unfinished single games were successfully deleted."))

	def __reset_tournament_games(self):
		tournament_games = self.games_model.filter(tournament__isnull=False, status__in=[GAME_STATUS_CREATED, GAME_STATUS_PLAYING])
		if tournament_games:
			for game in tournament_games:
				game.status = GAME_STATUS_CREATED
				game.user1_score = 0
				game.user2_score = 0
				game.save()
			self.stdout.write(self.style.SUCCESS("All tournament games were successfully reseted."))
