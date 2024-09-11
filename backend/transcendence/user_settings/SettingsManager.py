from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from user_auth.models import User
from .models import UserSettings

from user_profile.aux import get_image_url
from user_profile.forms import ImageForm
from PIL import Image
from io import BytesIO
import os

user_profile_model = ModelManager(UserProfileInfo)
user_settings_model = ModelManager(UserSettings)
user_model = ModelManager(User)

class SettingsManager:
	def __init__(self, user) -> None:
		self.user = user
		self.user_profile = user_profile_model.get(user=user)
		self.user_settings = user_settings_model.get(user=user)

	def get_current_settings(self):
		settings = {
			'username': self.user.username,
			'bio': self.user_profile.bio,
			'image': get_image_url(self.user_profile),
			'game_theme': self.user_settings.game_theme,
			'language': self.user_settings.language
		}
		return settings

	def update_username(self, new_username):
		username = new_username.strip()
		if username:
			user = user_model.get(username=username)
			if not user or (user.id == self.user.id):
				if username != self.user.username:
					self.user.username = username
					self.user.save()
				return True
		return False

	def update_bio(self, new_bio):
		bio = new_bio.strip()
		if bio != self.user_profile.bio:
			self.user_profile.bio = bio
			self.user_profile.save()
		return True

	def update_language(self, new_language):
		language = new_language.strip()
		if language:
			if language != self.user_settings.language:
				self.user_settings.language = language
				self.user_settings.save()
			return True
		return False

	def update_game_theme(self, new_game_theme):
		game_theme = new_game_theme.strip()
		if game_theme:
			if game_theme != self.user_settings.game_theme:
				self.user_settings.game_theme = game_theme
				self.user_settings.save()
			return True
		return False

	def update_image_seed(self, new_image_seed):
		image_seed = new_image_seed.strip()
		if image_seed:
			self.__remove_image_from_profile()
			if image_seed != self.user_profile.default_image_seed:
				self.user_profile.default_image_seed = image_seed
				self.user_profile.save()
		return True

	def update_image(self, request_body, request_file):
		form = ImageForm(request_body, request_file)
		if form.is_valid():
			file = request_file['image']
			if file and self.__is_valid_image_file(file.name):
				file_extension = self.__get_file_extension(file.name)
				new_image_data = file.read()
				if self.user_profile:
					image = Image.open(BytesIO(new_image_data))
					output = BytesIO()
					# quality goes from 1 up to 95 (the lower the number the lighter and lower quality the image)
					image.save(output, format=file_extension, quality=25)
					compressed_image_data = output.getvalue()
					self.user_profile.profile_image = new_image_data
					self.user_profile.compressed_profile_image = compressed_image_data
					self.user_profile.save()
					return True
		return False

	def __remove_image_from_profile(self):
		if self.user_profile.compressed_profile_image:
			self.user_profile.compressed_profile_image = None
			self.user_profile.profile_image = None
			self.user_profile.save()

	def __is_valid_image_file(self, file_name):
		extension = self.__get_file_extension(file_name)
		if extension:
			if extension == 'PNG' or extension == 'JPEG':
				return True
		return False

	def __get_file_extension(self, filename):
		filename, extension = os.path.splitext(filename)
		if filename and extension:
			return extension[1:].upper()
		return None
