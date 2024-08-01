from custom_utils.auth_utils import is_authenticated, get_authenticated_user
from channels.generic.websocket import AsyncWebsocketConsumer
from custom_utils.models_utils import ModelManager
from channels.exceptions import StopConsumer
from asgiref.sync import sync_to_async
from user_auth.models import User
from .models import Games, GameRequests
import asyncio
import json

from datetime import datetime
from .Games import games_dict

from .utils import GAME_STATUS_CREATED, GAME_STATUS_PLAYING, GAME_STATUS_FINISHED

from .Lobby import lobby_dict

game_req_model = ModelManager(GameRequests)
game_model = ModelManager(Games)
user_model = ModelManager(User)

SLEEP_TIME_MILISECONDS = 10
SLEEP_TIME_SECONDS = 0
SLEEP_TIME = SLEEP_TIME_SECONDS + (0 if not SLEEP_TIME_MILISECONDS else SLEEP_TIME_MILISECONDS / 1000)

class Game(AsyncWebsocketConsumer):

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.user = None
		self.access_data = None
		self.room_group_name = None
		self.task = None
		self.lobby = None
		self.game_info = None

	async def connect(self):
		await self.accept()
		self.access_data = self.scope['access_data']
		if await sync_to_async(is_authenticated)(self.access_data):
			self.user = await sync_to_async(get_authenticated_user)(self.access_data.sub)
		if not self.user:
			await self.close(4000)
			return

		game_request_id = int(self.scope['url_route']['kwargs']['game_request_id'])
		if game_request_id:
			self.lobby = await sync_to_async(self.__get_game_lobby)(game_request_id)
		else:
			if self.user.id in lobby_dict:
				self.lobby = lobby_dict[self.user.id]

		if self.lobby:
			self.room_group_name = "game_lobby_" + str(self.lobby.get_host_id())
		else:
			await self.close(4000)
			return

		if self.room_group_name:
			await self.channel_layer.group_add(
				self.room_group_name,
				self.channel_name
			)

	async def disconnect(self, close_code):
		await self.__stop_game_routine()
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

		if data_type == "ready":
			await self.__set_ready_state()
			if await self.__is_already_ready():
				self.__start_game_routine()
		elif data_type == "key":
			self.game.update_paddle(key=data_json['key'], status=data_json['status'], user_id=self.user.id)

	async def __start_game_routine(self):
		if lobby_dict[self.user.id] == self.lobby:
			user_2_id = lobby_dict[self.user.id].get_user_2_id()
			self.game_info = await sync_to_async(game_model.create)(user1=self.user, user2=user_2_id)
			games_dict.create_new_game(self.game_info.id, self.user.id, user_2_id)
			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'send_start_game',
					"game_id": self.game_info.id
				}
			)
			del lobby_dict[self.user.id]
		self.lobby = None

	async def send_start_game(self, event):
		self.game = games_dict.get_game_obj(event['game_id'])
		self.task = asyncio.create_task(self.__game_routine())

	async def __stop_game_routine(self):
		if self.task:
			self.task.cancel()
			await self.task

	async def __game_routine(self):
		await asyncio.sleep(1)
		while True:
			game_ended = self.game.is_end_game()
			await self.__send_updated_data()
			if game_ended:
				await self.__finish_game()
				break
			self.game.update()
			await asyncio.sleep(SLEEP_TIME)

	async def __send_updated_data(self):
		scores = self.game.get_score_values()
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'send_game_status',
				"game_state": {
					"ball": self.game.get_ball_positions(),
					"paddle_left_pos": self.game.get_paddle_left(),
					"paddle_right_pos": self.game.get_paddle_right(),
					"player_1_score": scores['player_1_score'],
					"player_2_score": scores['player_2_score'],
				}
			}
		)

	async def send_game_status(self, event):
		await self.send(text_data=json.dumps({
			'type': 'message',
			'game_state': event['game_state']
		}))

	async def __get_game_info(self, game_id):
		game_info = None
		if game_id:
			game_info = await sync_to_async(game_model.get)(id=game_id)
		return game_info

	def __has_user_access_to_game(self):
		if self.game_info.user1.id == self.user.id or self.game_info.user2.id == self.user.id:
			return True
		return False

	async def __is_already_ready(self):
		if await sync_to_async(self.lobby.is_ready_to_start)():
			return True
		return False

		""" self.game_info = await self.__get_game_info(self.game_info.id)
		if self.game_info.status == GAME_STATUS_PLAYING:
			return False
		else:
			if await sync_to_async(self.game.get_ready_to_start)():
				self.game_info.status = GAME_STATUS_PLAYING
				await sync_to_async(self.game_info.save)()
				print("The game has Started!")
				return True
		return False """

	async def __set_ready_state(self):
		await sync_to_async(self.lobby.update_ready_status)(self.user.id)

	async def __finish_game(self):
		if self.game_info:
			self.game_info = await self.__get_game_info(self.game_info.id)
			scores = await sync_to_async(self.game.get_score_values)()
			self.game_info.user1_score = scores['player_1_score']
			self.game_info.user2_score = scores['player_2_score']
			self.game_info.status = GAME_STATUS_FINISHED
			await sync_to_async(self.game_info.save)()

	def __get_game_lobby(self, game_req_id):
		game_req = game_req_model.get(id=game_req_id)
		from_user_id = game_req.from_user.id
		to_user_id =  game_req.to_user.id
		if to_user_id == self.user.id:
			if from_user_id in lobby_dict:
				return lobby_dict[from_user_id]
		return None
