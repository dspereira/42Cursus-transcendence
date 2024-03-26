from django.core.management.base import BaseCommand
from user_auth.models import User
from live_chat.models import ChatRoom
import random

class Command(BaseCommand):
    help = 'Generate random ChatRooms'

    def add_arguments(self, parser):
        parser.add_argument('total_chatrooms', type=int, help='Number of chatrooms to create')

    def get_new_random_number(self):
        number = random.randint(10000, 99999)
        return number

    def chat_room_exists(self, name):
        return ChatRoom.objects.filter(name=name).exists()

    def handle(self, *args, **kwargs):
        total_chatrooms = kwargs['total_chatrooms']
        for i in range(total_chatrooms):
            room_name = ""
            while 1:
                room_name = f'room_{self.get_new_random_number()}'
                if not self.chat_room_exists(room_name):
                    break
            ChatRoom.objects.create(name=room_name)
            self.stdout.write(self.style.SUCCESS(f'Chat Room {room_name} created successfully'))
