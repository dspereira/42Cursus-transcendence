from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from user_auth.models import User
from .models import UserSettings

from user_profile.aux import get_image_url

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
        if username != self.user.username:
            self.user.username = username
            self.user.save()

    def update_bio(self, new_bio):
        bio = new_bio.strip()
        if bio != self.user_profile.bio:
            self.user_profile.bio = bio
            self.user_profile.save()

    def update_language(self, new_language):
        language = new_language.strip()
        if language != self.user_settings.language:
            self.user_settings.language = language
            self.user_settings.save()

    def update_game_theme(self, new_game_theme):
        game_theme = new_game_theme.strip()
        if game_theme != self.user_settings.game_theme:
            self.user_settings.game_theme = game_theme
            self.user_settings.save()
