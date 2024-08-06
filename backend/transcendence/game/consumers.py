from custom_utils.auth_utils import is_authenticated, get_authenticated_user
from channels.generic.websocket import AsyncWebsocketConsumer
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from channels.exceptions import StopConsumer
from user_profile.aux import get_image_url
from .models import Games, GameRequests
from asgiref.sync import sync_to_async
from user_auth.models import User
import asyncio
import json

from datetime import datetime
from .Games import games_dict

from .utils import GAME_STATUS_CREATED, GAME_STATUS_PLAYING, GAME_STATUS_FINISHED
from .utils import cancel_other_invitations

from .Lobby import lobby_dict

user_profile_info_model = ModelManager(UserProfileInfo)
game_req_model = ModelManager(GameRequests)
game_model = ModelManager(Games)
user_model = ModelManager(User)

SLEEP_TIME_MILISECONDS = 10
SLEEP_TIME_SECONDS = (0 if not SLEEP_TIME_MILISECONDS else SLEEP_TIME_MILISECONDS / 1000)

class Game(AsyncWebsocketConsumer):

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.user = None
		self.access_data = None
		self.room_group_name = None
		self.task = None
		self.lobby = None
		self.game_info = None
		self.game = None

	async def connect(self):
		await self.accept()
		self.access_data = self.scope['access_data']
		if await sync_to_async(is_authenticated)(self.access_data):
			self.user = await sync_to_async(get_authenticated_user)(self.access_data.sub)
		if not self.user:
			await self.close(4000)
			return

		lobby_id = int(self.scope['url_route']['kwargs']['lobby_id'])
		if lobby_id and await sync_to_async(self.__has_access_to_lobby)(lobby_id):
			self.lobby = lobby_dict[lobby_id]

		if self.lobby:
			self.room_group_name = "game_lobby_" + str(self.lobby.get_host_id())
		else:
			await self.close(4000)
			return

		await sync_to_async(self.lobby.update_connected_status)(self.user.id, True)

		if self.room_group_name:
			await self.channel_layer.group_add(
				self.room_group_name,
				self.channel_name
			)
		await self.send_users_info_to_group()

	async def send_users_info_to_group(self):
		await self.channel_layer.group_send(
			self.room_group_name, {'type': 'send_users_info'}
		)

	async def send_users_info(self, event):
		await self.send(text_data=json.dumps({
			'type': 'users_info',
			'users_info': await sync_to_async(self.__get_users_info)()
		}))

	async def disconnect(self, close_code):
		await self.__stop_game_routine()

		if not self.game:
			if self.user.id == self.lobby.get_host_id():
				await sync_to_async(cancel_other_invitations)(self.user)
				if not self.lobby.is_only_host_online():
					await self.channel_layer.group_send(
						self.room_group_name, {'type': 'send_end_lobby_session'}
					)
		elif self.game:
			game_status = self.game.get_status()
			if game_status == GAME_STATUS_PLAYING:
				print("\nO jogo foi interrompido a meio!\n")
			else:
				print("\nO jogo Terminou\n")

		await sync_to_async(self.lobby.update_connected_status)(self.user.id, False)
		await self.send_users_info_to_group()
		if self.room_group_name:
			await self.channel_layer.group_discard(
				self.room_group_name,
				self.channel_name
			)
		raise StopConsumer()

	async def send_end_lobby_session(self, event):
		await self.send(text_data=json.dumps({
			'type': 'end_lobby_session'
		}))

	async def receive(self, text_data):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		data_json = json.loads(text_data)
		data_type = data_json['type']

		if data_type == "update_ready_status":
			await self.__update_ready_status()
			if await self.__is_already_ready():
				await self.__start_game_routine()
		elif data_type == "key":
			self.game.update_paddle(key=data_json['key'], status=data_json['status'], user_id=self.user.id)

	async def __start_game_routine(self):
		user_1 = await sync_to_async(user_model.get)(id=self.lobby.get_host_id())
		user_2 = await sync_to_async(user_model.get)(id=self.lobby.get_user_2_id())
		self.game_info = await sync_to_async(game_model.create)(user1=user_1, user2=user_2)
		games_dict.create_new_game(self.game_info.id, user_1.id, user_2.id)
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'send_start_game',
				"game_id": self.game_info.id
			}
		)

	async def send_start_game(self, event):
		if self.lobby.get_host_id() == self.user.id:
			await sync_to_async(cancel_other_invitations)(self.user)
		self.game = await sync_to_async(games_dict.get_game_obj)(event['game_id'])
		self.game_info = await sync_to_async(game_model.get)(id=event['game_id'])
		await self.__send_updated_data()
		self.task = asyncio.create_task(self.__game_routine())

	async def __stop_game_routine(self):
		if self.task:
			self.task.cancel()
			await self.task

	async def __game_routine(self):
		self.game.set_status(GAME_STATUS_PLAYING)
		await sync_to_async(self.game.start_time)()
		while True:
			time = await sync_to_async(self.game.get_time_to_start)()
			if 3 - time < 0:
				break
			await self.__send_timer_data(3 - time)
			await asyncio.sleep(SLEEP_TIME_SECONDS * 10)
		while True:
			game_ended = self.game.is_end_game()
			if not game_ended:
				await self.__send_updated_data()
			else:
				break
			self.game.update()
			await asyncio.sleep(SLEEP_TIME_SECONDS)
		await self.__finish_game()

	async def __send_timer_data(self, time):
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'send_timer_data',
				'time': time
			}
		)

	async def send_timer_data(self, event):
		await self.send(text_data=json.dumps({
			'type': 'time_to_start',
			'time': event['time']
		}))

	async def __send_updated_data(self):
		scores = self.game.get_score_values()
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'send_game_state',
				"game_state": {
					"ball": self.game.get_ball_positions(),
					"paddle_left_pos": self.game.get_paddle_left(),
					"paddle_right_pos": self.game.get_paddle_right(),
					"player_1_score": scores['player_1_score'],
					"player_2_score": scores['player_2_score'],
				}
			}
		)

	async def send_game_state(self, event):
		await self.send(text_data=json.dumps({
			'type': 'game_state',
			'game_state': event['game_state']
		}))

	async def __get_game_info(self, game_id):
		game_info = None
		if game_id:
			game_info = await sync_to_async(game_model.get)(id=game_id)
		return game_info

	async def __is_already_ready(self):
		if await sync_to_async(self.lobby.is_ready_to_start)():
			return True
		return False

	async def __update_ready_status(self):
		await sync_to_async(self.lobby.update_ready_status)(self.user.id)
		await self.send_users_info_to_group()

	async def __finish_game(self):
		self.game_info = await self.__get_game_info(self.game_info.id)
		if self.game_info.status != GAME_STATUS_FINISHED:
			await self.__send_updated_data()
			scores = await sync_to_async(self.game.get_score_values)()
			self.game_info.user1_score = scores['player_1_score']
			self.game_info.user2_score = scores['player_2_score']
			self.game_info.status = GAME_STATUS_FINISHED
			self.game_info.winner = await sync_to_async(user_model.get)(id=self.game.get_winner())
			await sync_to_async(self.game_info.save)()
			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'send_finished_game',
					"winner_username": self.game_info.winner.username
				}
			)

	def __has_access_to_lobby(self, lobby_id):
		if lobby_id in lobby_dict:
			lobby = lobby_dict[lobby_id]
			if lobby.has_access(self.user.id):
				return True
		return False

	def __get_users_info(self):
		users_info = {"host": None, "guest": None}
		user_id = self.lobby.get_host_id()
		if self.lobby.is_user_connected(user_id):
			self.__set_display_user_info(users_info, user_id, 'host')
		user_id = self.lobby.get_user_2_id()
		if self.lobby.is_user_connected(user_id):
			self.__set_display_user_info(users_info, user_id, 'guest')
		return users_info

	def __set_display_user_info(self, users_info, user_id, player_type):
		user = user_model.get(id=user_id)
		user_profile = user_profile_info_model.get(user=user)
		is_ready = self.lobby.is_user_ready(user_id)
		display_info = {
			"username": user.username,
			"image": get_image_url(user_profile),
			"is_ready": is_ready
		}
		users_info[player_type] = display_info

	async def send_finished_game(self, event):
		await self.send(text_data=json.dumps({
			'type': 'finished_game',
			'winner': event['winner_username']
		}))
