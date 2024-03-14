from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
import random

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
            email = f'user_{i}@example.com'
            password = '123'
            User.objects.create_user(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'User {username} created successfully'))
