from friendships.models import FriendList, FriendRequests
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from user_profile.aux import get_image_url
from user_auth.models import User

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
			friends_users_list += list(user_profile_info_model.filter(id=friend.user2.id).values('id', 'default_image_seed', 'default_profile_image_url'))
	else:
		for friend in friends:
			friends_users_list += list(user_profile_info_model.filter(id=friend.user1.id).values('id', 'default_image_seed', 'default_profile_image_url'))
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

def remove_user_and_friends_from_users_list(user_id, users_list):
	friends_list = get_friends_users_list(friends=get_friend_list(user_id=user_id, side="left"), side="left")
	friends_list += get_friends_users_list(friends=get_friend_list(user_id=user_id, side="right"), side="right")
	friends_ids = {friend['id'] for friend in friends_list}
	friends_ids.add(user_id)
	result_users = [user for user in users_list if user['id'] not in friends_ids]
	return result_users

def get_friends_request_list(user, own: bool):
	"""
		Get the list of friend requests.

		If `own` is True, the function returns the list of requests made by the user to others.
		If `own` is False, it returns the list of requests made by others to the user.

		Args:
			user: The user object for whom the friend requests are being fetched.
			own (bool): Flag indicating whether to fetch requests made by the user or to the user.
	"""
	friends_requests_list= None
	if own:
		friends_requests = friend_requests_model.filter(from_user=user)
	else:
		friends_requests = friend_requests_model.filter(to_user=user)
	if friends_requests:
		friends_requests_list = list(friends_requests.values('id', 'from_user', 'to_user'))
	return friends_requests_list

def check_if_friend_request(users_list, requests_list):
	for users in users_list:
		users['friend_request_sent'] = False
	if requests_list:
		for user in users_list:
			for req in requests_list:
				if user['id'] == req['to_user']:
					user['friend_request_sent'] = True
					break

def rename_result_users_keys(users):
	old_username = 'default_image_seed'
	old_image = 'default_profile_image_url'
	for item in users:
		if old_username in item:
			item['username'] = item.pop(old_username)
		if old_image in item:
			item['image'] = item.pop(old_image)

def remove_users_with_friends_request(user, users_list):
	friends_requests = get_friends_request_list(user=user, own=False)
	if friends_requests:
		for user_elm in users_list:
			for req in friends_requests:
				if user_elm['id'] == req['from_user']:
					users_list.remove(user_elm)
					break
