import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from custom_utils.auth_utils import is_authenticated, get_authenticated_user
from .models import FriendsRequestNotification, GameInviteNotification
from channels.exceptions import StopConsumer
from custom_utils.models_utils import ModelManager
from user_auth.models import User
import json

from .notifications import get_user_notifications
from .notifications import create_friend_request
from .notifications import create_game_invite

friend_req_notification_model = ModelManager(FriendsRequestNotification)
game_inv_notification_model = ModelManager(GameInviteNotification)
user_model = ModelManager(User)

# Apenas para debug
def print_entry(entry: str):
	print("------------------------------------------------")
	print(entry)
	print("------------------------------------------------")

class Notifications(AsyncWebsocketConsumer):

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.user = None
		self.access_data = None
		self.room_group_name = None

	async def connect(self):
		await self.accept()
		self.access_data = self.scope['access_data']
		if await sync_to_async(is_authenticated)(self.access_data):
			self.user = await sync_to_async(get_authenticated_user)(self.access_data.sub)
		if not self.user:
			await self.close(4000)
			return

		self.room_group_name = self.user.username

		print("----------------------------")
		print("USER LOGADO -> " + str(self.user.id) + " | " + str(self.user.username))
		print("----------------------------")

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

	async def disconnect(self, close_code):
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

		print("")
		print("===========================================================================")
		for key, value in data_json.items():
			print(f"{key}: {value}")
		print("===========================================================================")

		if data_json["type"] == "get_all_notifications":
			print_entry("get_all_notifications")
			notifications = await sync_to_async(get_user_notifications)(self.user)
			if notifications:
				print(notifications)
				await self.channel_layer.group_send(
					self.room_group_name,
					{
						'type': 'send_all_notifications',
						'notifications': notifications,
					}
				)
			else:
				print("Não existem notificações no momento.")
			print("------------------------------------------------")
		elif data_json["type"] == "friend_request":
			print_entry("friend_request")
			receiver_username = data_json["receiver_name"]
			if receiver_username != self.user.username:
				to_user = await sync_to_async(user_model.get)(username=receiver_username)
				if to_user:
					friend_req_notif = await sync_to_async(create_friend_request)(from_user=self.user, to_user=to_user)
					await self.channel_layer.group_send(
						to_user.username,
						{
							'type': 'send_friend_notification',
							'friend_req_notification': friend_req_notif,
						}
					)
				else:
					print("User does not exist!")
			else:
				print("Não podes enviar pedidos de amizade para ti próprio!")
		elif data_json["type"] == "game_invite":
			print_entry("game_invite")
			receiver_username = data_json["receiver_name"]
			game = data_json["game"]
			if receiver_username != self.user.username:
				to_user = await sync_to_async(user_model.get)(username=receiver_username)
				if to_user:
					game_inv_notif = await sync_to_async(create_game_invite)(from_user=self.user, to_user=to_user, game=game)
					await self.channel_layer.group_send(
						to_user.username,
						{
							'type': 'send_game_invite_notification',
							'game_inv_notification': game_inv_notif,
						}
					)
				else:
					print("User does not exist!")
			else:
				print("Não podes enviar pedidos de amizade para ti próprio!")
		elif data_json["type"] == "friend_request_status":
			print("Friend Request Status: " + str(data_json['status']))
		print("")

	async def send_all_notifications(self, event):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		await self.send(text_data=json.dumps({
			'type': 'send_all_notifications',
			'notifications': event['notifications'],
		}))

	async def send_friend_notification(self, event):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		await self.send(text_data=json.dumps({
			'type': 'send_friend_notification',
			'friend_req_notification': event['friend_req_notification'],
		}))

	async def send_game_invite_notification(self, event):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		await self.send(text_data=json.dumps({
			'type': 'send_game_invite_notification',
			'game_inv_notification': event['game_inv_notification'],
		}))
