from django.core.management.base import BaseCommand
from custom_utils.models_utils import ModelManager

from friendships.friendships import is_already_friend

from game.models import GameRequests
from user_auth.models import User

from custom_utils.requests_utils import set_exp_time
from game.Lobby import Lobby, lobby_dict
from game.utils import has_already_valid_game_request

game_requests_model = ModelManager(GameRequests)
user_model = ModelManager(User)

class Command(BaseCommand):
	help = 'Add all users as friend of the specified user id.'

	def add_arguments(self, parser):
		parser.add_argument('user_id', type=int, help='ID of the user')

	def handle(self, *args, **kwargs):
		user_id = kwargs['user_id']
		user = user_model.get(id=user_id)
		all_users = user_model.all()
		if user:
			all_users = self.__remove_user_from_list(all_users, user_id)
			lobby_dict[user.id] = Lobby(user.id)
			if not lobby_dict[user.id]:
				self.stdout.write(self.style.ERROR("Error: Failed to create game lobby!"))
				return
			for user2 in all_users:
				if is_already_friend(user1=user, user2=user2):
					if has_already_valid_game_request(user1=user2, user2=user):
						self.stdout.write(self.style.ERROR("Error: Has already game request!"))
						break
					game_request = game_requests_model.create(from_user=user2, to_user=user)
					set_exp_time(request=game_request)
					if not game_request:
						self.stdout.write(self.style.ERROR("Error: Failed to create game request in DataBase"))
						break
				else:
					self.stdout.write(self.style.ERROR("Error: Users are not friends!"))
					break
				self.stdout.write(self.style.SUCCESS(f'Game Requested Created With Success!'))
		else:
			self.stdout.write(self.style.ERROR(f'Invalid user id.'))

	def __remove_user_from_list(self, all_users, user_id):
		new_users_list = []
		for user in all_users:
			if user.id != user_id:
				new_users_list.append(user)				
		return new_users_list
