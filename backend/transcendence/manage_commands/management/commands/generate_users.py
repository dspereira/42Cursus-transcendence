from django.core.management.base import BaseCommand
from user_auth.models import User
import random
from custom_utils.models_utils import ModelManager
from custom_utils.blitzpong_bot_utils import send_custom_bot_message
from custom_utils.blitzpong_bot_utils import generate_welcome_message
from user_auth.auth_utils import create_user_profile_info
from user_auth.auth_utils import add_bot_as_friend
from user_settings.models import UserSettings
from two_factor_auth.two_factor import setup_two_factor_auth

user_model = ModelManager(User)
user_settings_model = ModelManager(UserSettings)

class Command(BaseCommand):
    help = 'Generate random users'

    def add_arguments(self, parser):
        parser.add_argument('total_users', type=int, help='Number of users to create')

    def get_new_random_number(self):
        number = random.randint(10000, 99999)
        return number

    def user_exists(self, username):
        return User.objects.filter(username=username).exists()

    def handle(self, *args, **kwargs):
        total_users = kwargs['total_users']
        for i in range(total_users):
            username = ""
            while 1:
                username = f'user_{self.get_new_random_number()}'
                if not self.user_exists(username):
                    break
            email = f'{username}@bot_user.com'
            password = '123'
            user = user_model.create(username=username, email=email, password=password)
            if not user:
                self.stdout.write(self.style.ERROR(f'Failed to create User'))
                return
            user.active = True
            user.save()

            if not create_user_profile_info(user=user):
                self.stdout.write(self.style.ERROR(f'Failed to create User Profile'))
                return

            user_settings = user_settings_model.create(user=user)
            if not user_settings:
                self.stdout.write(self.style.ERROR(f'Failed to create User Profile'))
                return

            setup_two_factor_auth(user)
            add_bot_as_friend(user)
            send_custom_bot_message(user, generate_welcome_message(user.username))
            self.stdout.write(self.style.SUCCESS(f'User {username} created successfully'))
