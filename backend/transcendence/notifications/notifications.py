from .models import FriendsRequestNotification, GameInviteNotification
from custom_utils.models_utils import ModelManager
from asgiref.sync import sync_to_async
from user_auth.models import User
import json

friend_req_notification_model = ModelManager(FriendsRequestNotification)
game_inv_notification_model = ModelManager(GameInviteNotification)
user_model = ModelManager(User)

async def get_user_notifications(user: User):

	friend_req = await sync_to_async(friend_req_notification_model.filter)(to_user=user) 
	game_inv = await sync_to_async(game_inv_notification_model.filter)(to_user=user)

	if not friend_req and not game_inv:
		return None

	friend_req = [{'type': 'friend_request', **entry.__dict__} for entry in friend_req]
	game_inv = [{'type': 'game_invite', **entry.__dict__} for entry in game_inv]

	all_notifications = list(friend_req) + list(game_inv)
	all_notifications.sort(key=lambda x: x.timestamp)

	all_notifications_info = []

	for notification in all_notifications:
		notification_data = {}
		notification_data['id'] = notification.id
		notification_data['type'] = notification.type
		notification_data['from_user'] = notification.from_user
		notification_data['message'] = str(notification)
		all_notifications_info.append(notification_data)

	return json.dumps(all_notifications_info)

async def create_friend_request(from_user: User, to_user: User):
	await sync_to_async(friend_req_notification_model.create)(from_user=from_user, to_user=to_user)
