from .models import FriendsRequestNotification, GameInviteNotification
from custom_utils.models_utils import ModelManager
from asgiref.sync import sync_to_async
from user_auth.models import User
from operator import attrgetter
import json

friend_req_notification_model = ModelManager(FriendsRequestNotification)
game_inv_notification_model = ModelManager(GameInviteNotification)
user_model = ModelManager(User)

NOTIFICATION_FRIEND_REQUEST = "friend_request"
NOTIFICATION_GAME_INVITE = "game_invite"

def get_friend_request_notifications(user: User):
	friend_req = friend_req_notification_model.filter(to_user=user) 
	return friend_req

def get_game_invite_notifications(user: User):
	game_inv = game_inv_notification_model.filter(to_user=user) 
	return game_inv

def get_all_notifications(user: User):
	friend_req = get_friend_request_notifications(user)
	game_inv = get_game_invite_notifications(user)

	if not friend_req and not game_inv:
		return None

	if friend_req:
		all_notifications = list(friend_req)

	if game_inv:
		all_notifications += list(game_inv)
	
	return all_notifications

def get_user_notifications(user: User):

	all_notifications = get_all_notifications(user)

	if not all_notifications:
		return None

	for notification in all_notifications:
		if not notification.read:
			notification.read = True
			notification.save()

	all_notifications = sorted(all_notifications, key=attrgetter('timestamp'))

	all_notifications_info = []

	for notification in all_notifications:
		notification_data = notification.get_data()
		all_notifications_info.append(notification_data)

	return json.dumps(all_notifications_info)

def create_friend_request(from_user: User, to_user: User):
	friend_req = friend_req_notification_model.create(from_user=from_user, to_user=to_user)
	return json.dumps(friend_req.get_data())

def create_game_invite(from_user: User, to_user: User, game: int):
	game_inv = game_inv_notification_model.create(from_user=from_user, to_user=to_user, game=game)
	return json.dumps(game_inv.get_data())

def has_unread_notifications(user: User):
	all_notifications = get_all_notifications(user)

	unread_notifications_counter = 0

	if all_notifications:
		for notification in all_notifications:
			if not notification.read:
				unread_notifications_counter += 1

	return unread_notifications_counter

def update_notification_read_status(notification_type: str, notification_id: int):

	if notification_type == NOTIFICATION_FRIEND_REQUEST:
		notification = friend_req_notification_model.get(id=notification_id)
	elif notification_type == NOTIFICATION_GAME_INVITE:
		notification = game_inv_notification_model.get(id=notification_id)

	notification.read = True
	notification.save()
