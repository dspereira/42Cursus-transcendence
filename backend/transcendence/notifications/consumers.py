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

friend_req_notification_model = ModelManager(FriendsRequestNotification)
game_inv_notification_model = ModelManager(GameInviteNotification)
user_model = ModelManager(User)

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

		print(data_json)

		if data_json["type"] == "get_all_notifications":
			notifications = await get_user_notifications(self.user)
			print("------------------------------------------------")
			if notifications:
				print(notifications)
			else:
				print("Não existem notificações no momento.")
			print("------------------------------------------------")

		""" message = data_json['message'].strip()
		if message:
			result_message = f"{self.username}: {message}"
			await sync_to_async(msg_model.create)(user=self.user, room=self.room, content=message)
			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'chat_message',
					'message': result_message,
				}
			) """

	""" async def chat_message(self, event):
		if not await sync_to_async(is_authenticated)(self.access_data):
			await self.close(4000)
			return
		await self.send(text_data=json.dumps({
			'type': 'chat_message',
			'message': event['message'],
		})) """
