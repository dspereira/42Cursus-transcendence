from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management.base import BaseCommand
from custom_utils.models_utils import ModelManager
from user_auth.auth_utils import create_user_profile_info
from user_auth.models import User
from user_settings.models import UserSettings
from user_settings.SettingsManager import SettingsManager
import random
import string

BOT_ID = 1
BOT_USERNAME = "BlitzPong"
BOT_EMAIL = "blitzpong@blitzpong.blitzpong"

user_model = ModelManager(User)
user_settings_model = ModelManager(UserSettings)

class Command(BaseCommand):
	help = 'Generate BlitzPong System Bot'

	def get_new_random_number(self):
		number = random.randint(10000, 99999)
		return number

	def user_exists(self, username):
		return User.objects.filter(username=username).exists()

	def handle(self, *args, **kwargs):
		if self.__user_already_exists():
			self.stdout.write(self.style.ERROR(f'BlitzPong Bot already exists!'))
		else:
			if not self.__create_bot_user():
				self.stdout.write(self.style.ERROR(f'Failed to create BlitzPong Bot!'))
			else:
				self.stdout.write(self.style.SUCCESS(f'BlitzPong Bot created with Success!'))

	def __user_already_exists(self):
		bot_user = user_model.get(username=BOT_USERNAME)
		if bot_user:
			return True
		return False

	def __create_bot_user(self):
		bot_user = None
		bot_user_profile = None
		bot_user_settings = None
		bot_password = self.__generate_password()
		bot_user = user_model.create(username=BOT_USERNAME, email=BOT_EMAIL, password=bot_password)
		bot_user_profile = create_user_profile_info(bot_user)
		if not bot_user_profile:
			self.__delete_elements_from_db(bot_user, bot_user_profile, bot_user_settings)
			return None
		bot_user_settings = user_settings_model.create(user=bot_user)
		if not bot_user_settings:
			self.__delete_elements_from_db(bot_user, bot_user_profile, bot_user_settings)
			return None
		if not self.__set_bot_profile_settings(bot_user):
			self.__delete_elements_from_db(bot_user, bot_user_profile, bot_user_settings)
			return None
		return bot_user

	def __generate_password(self):
		characters = string.ascii_letters + string.digits + string.punctuation
		# password = ''.join(random.choice(characters) for i in range(100))
		password = "123"
		return password

	def __set_bot_profile_settings(self, bot_user):
		bot_settings_manager = SettingsManager(bot_user)
		with open('../bot_images/logo.png', 'rb') as f:
			image_file = SimpleUploadedFile(name='imagem.png', content=f.read(), content_type='image/png')
			if not bot_settings_manager.update_image(image_file):
				return False
			if not bot_settings_manager.update_bio("Master of Pong, breaker of paddles. If the ball's missing, I probably took it. Good luck!"):
				return False
		return True

	def __delete_elements_from_db(self, bot_user, bot_user_profile, bot_user_settings):
		self.__delete_from_db(bot_user)
		self.__delete_from_db(bot_user_profile)
		self.__delete_from_db(bot_user_settings)

	def __delete_from_db(self, element):
		if element:
			element.delete
