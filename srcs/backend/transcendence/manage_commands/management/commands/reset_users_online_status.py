from django.core.management.base import BaseCommand
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from django.db.models import Q

class Command(BaseCommand):
	help = 'Reset all users online status.'

	def handle(self, *args, **kwargs):
		user_profile_model = ModelManager(UserProfileInfo)
		users = user_profile_model.filter(~Q(online=0))
		if users.exists():
			users.update(online=0)
			print("All users' online statuses have been successfully reset.")
		else:
			print("User list is empty. No statuses to reset.")
