from friendships.models import FriendList, FriendRequests
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from user_profile.aux import get_image_url
from django.http import JsonResponse
from user_auth.models import User
import json

user_profile_info_model = ModelManager(UserProfileInfo)
friend_requests_model = ModelManager(FriendRequests)
friend_list_model = ModelManager(FriendList)
user_model = ModelManager(User)

def get_friend_info(friendsip, side):
	if side == "left":
		user = friendsip.user1
	else:
		user = friendsip.user2
	image_url = get_image_url(user_profile_info_model.get(user_id=user.id))
	info = {
		"id": user.id,
		"username": user.username,
		"image": image_url
	}
	return info

def get_friend_list(user_id, side):
	data = []
	user = user_model.get(id=user_id)
	if user:
		if side == "left":
			filtered_list = friend_list_model.filter(user1=user)
		else:
			filtered_list = friend_list_model.filter(user2=user)
		if filtered_list:
			data = list(filtered_list)
	return data

def get_friends_users_list(friends, side):
	friends_users_list = []
	if side == "left":
		for friend in friends:
			friends_users_list += list(user_profile_info_model.filter(id=friend.user2.id).values('id', 'default_image_seed'))
	else:
		for friend in friends:
			friends_users_list += list(user_profile_info_model.filter(id=friend.user1.id).values('id', 'default_image_seed'))
	return friends_users_list

def is_already_friend(user1, user2):
	check_1 = friend_list_model.get(user1=user1, user2=user2)
	if check_1:
		return check_1
	check_2 = friend_list_model.get(user1=user2, user2=user1)
	if check_2:
		return check_2
	return None

def is_request_already_maded(user1, user2):
	if friend_requests_model.get(from_user=user1, to_user=user2):
		return True
	if friend_requests_model.get(from_user=user2, to_user=user1):
		return True
	return False
