
from custom_utils.auth_utils import is_authenticated, get_authenticated_user
from channels.generic.websocket import AsyncWebsocketConsumer
from custom_utils.models_utils import ModelManager
from channels.exceptions import StopConsumer
from asgiref.sync import sync_to_async
from user_auth.models import User
from .models import Games
import asyncio
import json

from datetime import datetime
from .GameLogic import GameLogic

game_model = ModelManager(Games)
user_model = ModelManager(User)

SLEEP_TIME_MILISECONDS = 10
SLEEP_TIME_SECONDS = 0
SLEEP_TIME = SLEEP_TIME_SECONDS + (0 if not SLEEP_TIME_MILISECONDS else SLEEP_TIME_MILISECONDS / 1000)

# Apenas para debug
def print_entry(entry: str):
	print("------------------------------------------------")
	print(entry)
	print("------------------------------------------------")

class Game(AsyncWebsocketConsumer):

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.user = None
		self.access_data = None
		self.room_group_name = None
		self.task = None

	async def connect(self):
		await self.accept()
		self.access_data = self.scope['access_data']
		if await sync_to_async(is_authenticated)(self.access_data):
			self.user = await sync_to_async(get_authenticated_user)(self.access_data.sub)
		if not self.user:
			await self.close(4000)
			return

		self.game = GameLogic()

		self.room_group_name = str(self.user.id)

		print()
		print(f"USER: {self.user.username}")
		print()

		self.task = asyncio.create_task(self.send_data())

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

	async def disconnect(self, close_code):
		if self.task:
			self.task.cancel()
		if self.room_group_name:
			await self.channel_layer.group_discard(
				self.room_group_name,
				self.channel_name
			)
		raise StopConsumer()

	async def receive(self, text_data):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		data_json = json.loads(text_data)
		data_type = data_json['type']

		print()
		print(F"TYPE -> {data_type}")
		print()
		
		if data_type == "start_game":
			self.task = asyncio.create_task(self.send_data())

	async def send_data(self):
		while True:

			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'send_game_status',
					"game_state": {"ball": self.game.get_ball_positions()}
				}
			)

			self.game.update()

			await asyncio.sleep(SLEEP_TIME)

	async def send_game_status(self, event):
		await self.send(text_data=json.dumps({
			'type': 'message',
			'game_state': event['game_state']
		}))
