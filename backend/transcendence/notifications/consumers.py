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
from .notifications import has_unread_notifications
from .notifications import update_notification_read_status
from .notifications import create_notification

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
		elif data_json["type"] == "has_unread_notifications":
			print_entry("has_unread_notifications")
			unread_notifications_counter = await sync_to_async(has_unread_notifications)(self.user)
			await self.channel_layer.group_send(
				self.user.username,
				{
					'type': 'unread_notifications_counter',
					'unread_notifications_counter': unread_notifications_counter,
				}
			)
		elif data_json["type"] == "update_notification_read_status":
			print_entry("update_notification_read_status")
			notification_type = data_json["notification_type"]
			notification_id = data_json["notification_id"]
			await sync_to_async(update_notification_read_status)(notification_type, notification_id)
		elif data_json["type"] == "friend_request":
			print_entry("friend_request")
			to_user = await sync_to_async(user_model.get)(username=data_json["receiver_name"])
			if to_user and to_user.username!= self.user.username:
				data = {"from_user": self.user, "to_user": to_user, "game": data_json["game"]}
				friend_req_notif = await sync_to_async(create_notification)(friend_req_notification_model, data)
				await self.channel_layer.group_send(
					to_user.username,
					{
						'type': 'send_friend_notification',
						'friend_req_notification': friend_req_notif,
					}
				)
				await self.channel_layer.group_send(
					to_user.username,
					{
						'type': 'new_notification',
					}
				)
			else:
				print("Invalid User")
		elif data_json["type"] == "game_invite":
			print_entry("game_invite")
			to_user = await sync_to_async(user_model.get)(username=data_json["receiver_name"])
			if to_user and to_user.username!= self.user.username:
				data = {"from_user": self.user, "to_user": to_user, "game": data_json["game"]}
				game_inv_notif = await sync_to_async(create_notification)(game_inv_notification_model, data)
				await self.channel_layer.group_send(
					to_user.username,
					{
						'type': 'send_game_invite_notification',
						'game_inv_notification': game_inv_notif,
					}
				)
				await self.channel_layer.group_send(
					to_user.username,
					{
						'type': 'new_notification',
					}
				)
			else:
				print("Invalid User")
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

	async def new_notification(self, event):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		await self.send(text_data=json.dumps({
			'type': 'new_notification',
		}))

	async def unread_notifications_counter(self, event):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		await self.send(text_data=json.dumps({
			'type': 'unread_notifications_counter',
			'unread_notifications_counter': event['unread_notifications_counter']
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
