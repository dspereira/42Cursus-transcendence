from two_factor_auth.two_factor import is_valid_phone_number
from custom_utils.auth_utils import is_valid_username
from custom_utils.models_utils import ModelManager
from two_factor_auth.models import OtpUserOptions
from user_profile.models import UserProfileInfo
from user_profile.aux import get_image_url
from user_auth.models import User
from .models import UserSettings
from io import BytesIO
from PIL import Image
import os

user_profile_model = ModelManager(UserProfileInfo)
otp_user_opt_model = ModelManager(OtpUserOptions)
user_settings_model = ModelManager(UserSettings)
user_model = ModelManager(User)

class SettingsManager:
	def __init__(self, user) -> None:
		self.user = user
		self.user_profile = user_profile_model.get(user=user)
		self.user_settings = user_settings_model.get(user=user)
		self.user_otp_settings = otp_user_opt_model.get(user=user)

	def get_current_settings(self):
		settings = {
			'username': self.user.username,
			'bio': self.user_profile.bio,
			'image': get_image_url(self.user_profile),
			'game_theme': self.user_settings.game_theme,
			'language': self.user_settings.language,
			'tfa': self.__get_tfa_settings()
		}
		return settings

	def update_username(self, new_username):
		if new_username is not None:
			username = str(new_username).strip() if new_username else None
			if username:
				if not is_valid_username(username):
					return False
				user = user_model.get(username=username)
				if not user or (user.id == self.user.id):
					if username != self.user.username:
						self.user.username = username
						self.user.save()
					return True
		return False

	def update_bio(self, new_bio):
		if new_bio is not None:
			bio = str(new_bio).strip()
			bio_len = len(bio)
			if bio_len >= 1 and bio_len <= 255:
				if bio != self.user_profile.bio:
					self.user_profile.bio = bio
					self.user_profile.save()
				return True
		return False

	def update_language(self, new_language):
		if new_language is not None:
			language = str(new_language).strip() if new_language else None
			if language:
				if self.__is_valid_language(language):
					if language != self.user_settings.language:
						self.user_settings.language = language
						self.user_settings.save()
					return True
		return False

	def update_game_theme(self, new_game_theme):
		if new_game_theme is not None:
			game_theme = str(new_game_theme).strip() if new_game_theme else None
			if game_theme:
				if game_theme.isdigit() and int(game_theme) >= 0 and int(game_theme) <= 4:
					if game_theme != self.user_settings.game_theme:
						self.user_settings.game_theme = game_theme
						self.user_settings.save()
					return True
		return False

	def update_image_seed(self, new_image_seed):
		if new_image_seed is not None:
			image_seed = str(new_image_seed).strip()  if new_image_seed else None
			if image_seed:
				self.__remove_image_from_profile()
				if image_seed != self.user_profile.default_image_seed:
					self.user_profile.default_image_seed = image_seed
					self.user_profile.save()
			return True
		return False

	def update_image(self, image_file):
		file = image_file
		if file:
			file_extension = self.__get_file_extension(file.content_type)
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

	def update_tfa(self, tfa_options):
		if not isinstance(tfa_options.get('qr_code'), bool):
			return 'invalid QR Code value'
		new_qr_code = tfa_options['qr_code']
		if  new_qr_code != self.user_otp_settings.qr_code:
			self.user_otp_settings.qr_code = new_qr_code
		new_phone = tfa_options.get('phone')
		if not is_valid_phone_number(new_phone):
			return 'invalid Phone Number'
		if otp_user_opt_model.get(phone_number=new_phone):
			return 'Phone Number already in use'
		if new_phone != self.user_otp_settings.phone_number:
			self.user_otp_settings.phone_number = new_phone
		self.user_otp_settings.save()
		return None

	def __get_tfa_settings(self):
		return {
			'qr_code': self.user_otp_settings.qr_code,
			'phone': self.user_otp_settings.phone_number
		}

	def __remove_image_from_profile(self):
		if self.user_profile.compressed_profile_image:
			self.user_profile.compressed_profile_image = None
			self.user_profile.profile_image = None
			self.user_profile.save()

	def __get_file_extension(self, file_type):
		valid_content_types = {
			"image/png": "PNG",
			"image/jpeg": "JPEG",
			"image/webp": "WEBP",
		}
		if file_type in valid_content_types:
			return valid_content_types[file_type]
		return None

	def __is_valid_language(self, language):
		available_languages = ['en', 'pt', 'es']
		if language in available_languages:
			return True
		return False
