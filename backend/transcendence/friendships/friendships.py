from friendships.models import FriendList, FriendRequests
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from live_chat.models import ChatRoom
from user_profile.aux import get_image_url
from user_auth.models import User
from django.db.models import Q

user_profile_info_model = ModelManager(UserProfileInfo)
friend_requests_model = ModelManager(FriendRequests)
friend_list_model = ModelManager(FriendList)
chatroom_model = ModelManager(ChatRoom)
user_model = ModelManager(User)


from custom_utils.auth_utils import is_username_bot_username

def get_friend_list(user):
	data = []
	if user:
		filtered_list = friend_list_model.filter((Q(user1=user) | Q(user2=user)))
		if filtered_list:
			filtered_list = filtered_list.order_by('-last_chat_interaction')
			data = list(filtered_list)
	return data

def get_friends_users_list(friends, user_id, include_bot):
	friends_users_list = []
	if friends:
		for friend in friends:
			if friend.user1.id == user_id:
				is_username_bot = is_username_bot_username(friend.user2.username)
				if not is_username_bot or (is_username_bot and include_bot):
					friends_users_list.append(get_single_user_info(user_profile_info_model.get(user=friend.user2.id)))
			else:
				is_username_bot = is_username_bot_username(friend.user1.username)
				if not is_username_bot or (is_username_bot and include_bot):
					friends_users_list.append(get_single_user_info(user_profile_info_model.get(user=friend.user1.id)))
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
	user = user_model.get(id=user_id)
	friends_list = get_friends_users_list(friends=get_friend_list(user=user), user_id=user.id, include_bot=True)
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
					user['request_id'] = req['id']
					break

def remove_users_with_friends_request(user, users_list):
	friends_requests = get_friends_request_list(user=user, own=False)
	if friends_requests:
		for user_elm in users_list:
			for req in friends_requests:
				if user_elm['id'] == req['from_user']:
					users_list.remove(user_elm)
					break

def get_friend_request(user, request_id):
	friend_request = friend_requests_model.get(id=request_id, from_user=user)
	if not friend_request:
		friend_request = friend_requests_model.get(id=request_id, to_user=user)
	return friend_request

def delete_friend_chatroom(user, friend):
	room_name_1 = f'{user.id}_{friend.id}'
	room_name_2 = f'{friend.id}_{user.id}'

	room_1 = chatroom_model.get(name=room_name_1)
	if room_1:
		room_1.delete()
	else:
		room_2 = chatroom_model.get(name=room_name_2)
		if room_2:
			room_2.delete()

def get_friendship(user1, user2):
	friendship_1 = friend_list_model.get(user1=user1, user2=user2)
	if friendship_1:
		return friendship_1
	friendship_2 = friend_list_model.get(user1=user2, user2=user1)
	if friendship_2:
		return friendship_2
	return None

def update_friendship_block_status(friendship, friend, block_status):
	if friendship.user1.id == friend.id:
		friendship.user1_block = block_status
	elif friendship.user2.id == friend.id:
		friendship.user2_block = block_status
	friendship.save()

def get_users_info(users):
	users_info = []
	if users:
		for user in users:
			online = False
			if user.online:
				online = True

			info = {
				"id": user.user.id,
				"username": user.user.username,
				"image": get_image_url(user=user),
				"online": online
			}
			users_info.append(info)
		return users_info
	return None

def get_single_user_info(user):
	online = False
	info = None
	if user:
		if user.online:
			online = True
		info = {
			"id": user.user.id,
			"username": user.user.username,
			"image": get_image_url(user=user),
			"online": online
		}
	return info

def get_friendship_block_status(user, friendship):
	user_blocked = False
	friend_blocked = False
	block_status = False

	if user.id == friendship.user1.id:
		if friendship.user2_block:
			user_blocked = True
		if friendship.user1_block:
			friend_blocked = True
	else:
		if friendship.user1_block:
			user_blocked = True
		if friendship.user2_block:
			friend_blocked = True

	if user_blocked or friend_blocked:
		block_status = True
	
	return {"user_has_blocked": user_blocked, "friend_has_blocked": friend_blocked, "status": block_status}

def is_friend_blocked(user1, user2):
	friendship = get_friendship(user1, user2)
	if friendship.user1_block or friendship.user2_block:
		return True
	return False
