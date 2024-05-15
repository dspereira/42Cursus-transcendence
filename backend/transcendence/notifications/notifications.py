from .models import FriendsRequestNotification, GameInviteNotification
from custom_utils.models_utils import ModelManager
from asgiref.sync import sync_to_async
from user_auth.models import User
from operator import attrgetter
import json

friend_req_notification_model = ModelManager(FriendsRequestNotification)
game_inv_notification_model = ModelManager(GameInviteNotification)
user_model = ModelManager(User)

def get_user_notifications(user: User):

	friend_req = friend_req_notification_model.filter(to_user=user) 
	game_inv = game_inv_notification_model.filter(to_user=user)

	if not friend_req and not game_inv:
		return None

	if friend_req:
		all_notifications = list(friend_req)

	if game_inv:
		all_notifications += list(game_inv)

	all_notifications = sorted(all_notifications, key=attrgetter('timestamp'))

	all_notifications_info = []

	for notification in all_notifications:
		notification_data = notification.get_data()
		all_notifications_info.append(notification_data)

	print("---------------------------------------------------------------")
	for entry in all_notifications_info:
		print(entry)
		print("---------------------------------------------------------------")

	return json.dumps(all_notifications_info)

def create_friend_request(from_user: User, to_user: User):
	friend_req = friend_req_notification_model.create(from_user=from_user, to_user=to_user)

	print("::::::::::::::::::::::::::::::::::::::::::::::::::::::")
	print(json.dumps(friend_req.get_data()))
	print("::::::::::::::::::::::::::::::::::::::::::::::::::::::")

	return json.dumps(friend_req.get_data())
