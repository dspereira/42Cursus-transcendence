from django.core.management.base import BaseCommand
from custom_utils.models_utils import ModelManager

from friendships.friendships import is_already_friend
from friendships.friendships import is_request_already_maded

from friendships.models import FriendList
from live_chat.models import ChatRoom
from user_auth.models import User

friend_list_model = ModelManager(FriendList)
chatroom_model = ModelManager(ChatRoom)
user_model = ModelManager(User)

class Command(BaseCommand):
	help = 'Add all users as friend of the specified user id.'

	def add_arguments(self, parser):
		parser.add_argument('user_id', type=int, help='ID of the user')

	def get_user(self, user_id):
		return user_model.get(id=user_id)

	def handle(self, *args, **kwargs):
		user_id = kwargs['user_id']
		user = self.get_user(user_id)
		all_users = user_model.all()
		if user:
			all_users = self.__remove_user_from_list(all_users, user_id)
			for current_user in all_users:
				if not is_already_friend(user, current_user) and not is_request_already_maded(user, current_user):

					print("\nNão existem amizades feitas.\n")

					friendship = friend_list_model.create(user1=user , user2=current_user)
					if friendship:
						chat_name = str(user.id) + "_" + str(current_user.id)
						chatroom = chatroom_model.create(name=chat_name)
						if chatroom:
							self.stdout.write(self.style.SUCCESS(f'Users {user.username} and {current_user.username} are now friends.'))
						else:
							friendship.delete()
							self.stdout.write(self.style.ERROR("Error: Failed the criation of friend."))
					else:
						self.stdout.write(self.style.ERROR("Error: Failed the criation of friend."))
				else:
					self.stdout.write(self.style.SUCCESS(f'Users {user.username} and {current_user.username} are already friends.'))
		else:
			self.stdout.write(self.style.ERROR(f'Invalid user id.'))

	def __remove_user_from_list(self, all_users, user_id):
		new_users_list = []
		for user in all_users:
			if user.id != user_id:
				new_users_list.append(user)				
		return new_users_list
