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
			self.stdout.write(self.style.SUCCESS("All users online statuses have been successfully reset."))
		else:
			self.stdout.write(self.style.SUCCESS("User list is empty. No statuses to reset."))
