from django.core.management.base import BaseCommand
from user_auth.models import User
import random
from custom_utils.models_utils import ModelManager
from user_auth.auth_utils import create_user_profile_info

user_model = ModelManager(User)

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
            create_user_profile_info(user=user)

            #User.objects.create_user(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'User {username} created successfully'))
