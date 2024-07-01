from custom_decorators import accepted_methods, login_required
from friendships.models import FriendList, FriendRequests
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from django.http import JsonResponse
from user_auth.models import User
import json

from friendships.friendships import get_friend_list
from friendships.friendships import get_friends_users_list
from friendships.friendships import remove_user_and_friends_from_users_list
from friendships.friendships import get_friends_request_list
from friendships.friendships import check_if_friend_request
from friendships.friendships import rename_result_users_keys
from friendships.friendships import remove_users_with_friends_request
from friendships.friendships import get_friendship
from friendships.friendships import update_friendship_block_status

user_profile_info_model = ModelManager(UserProfileInfo)
friend_requests_model = ModelManager(FriendRequests)
friend_list_model = ModelManager(FriendList)
user_model = ModelManager(User)

@login_required
@accepted_methods(["POST"])
def update_block_status(request):
	if request.body:
		user = user_model.get(id=request.access_data.sub)
		if user:
			req_data = json.loads(request.body.decode('utf-8'))
			friend = user_model.get(id=req_data["friend"])
			status = True if req_data["status"] == "block" else False
			if friend:
				friendship = get_friendship(user, friend)
				if friendship:
					update_friendship_block_status(friendship, friend, status)
					return JsonResponse({"message": f"Block status updated to user {friend.username}"}, status=200)
				else:
					return JsonResponse({"message": "Error: Can't find friendship"}, status=409)
			else:
				return JsonResponse({"message": "Error: Can't find user to block"}, status=409)
		else:
			return JsonResponse({"message": "Error: Can't find user"}, status=409)
	else:
		return JsonResponse({"message": "Error: Empty Body"}, status=400)

@login_required
@accepted_methods(["GET"])
def search_user_by_name(request):
	user = user_model.get(id=request.access_data.sub)
	search_username = request.GET.get('key')
	users_values = None
	result_users = None
	if not search_username or search_username == "" or search_username == '""':
		users = user_profile_info_model.all()
		message = f"Search Username is empty!"
	else:
		users = user_profile_info_model.filter(default_image_seed__istartswith=search_username)
		message = f"Search Username: [{search_username}]"
	if users:
		users_values = list(users.values('id', 'default_image_seed', 'default_profile_image_url'))
		result_users = remove_user_and_friends_from_users_list(user_id=user.id, users_list=users_values)
		remove_users_with_friends_request(user=user, users_list=result_users)
		friends_requests_list = get_friends_request_list(user=user, own=True)
		check_if_friend_request(users_list=result_users, requests_list=friends_requests_list)
		rename_result_users_keys(users=result_users)
		result_users = sorted(result_users, key=lambda x: x["username"])
	return JsonResponse({"message": message, "users": result_users}, status=200)

@login_required
@accepted_methods(["GET"])
def search_friend_by_name(request):
	search_username = request.GET.get('key')
	friends_values = None
	user = user_model.get(id=request.access_data.sub)
	if user:
		friends_list = get_friends_users_list(friends=get_friend_list(user_id=user.id, side="left"), side="left")
		friends_list += get_friends_users_list(friends=get_friend_list(user_id=user.id, side="right"), side="right")
		if friends_list:
			if not search_username or search_username == "" or search_username == '""':
				friends_values = sorted(friends_list, key=lambda x: x["default_image_seed"])
			else:
				searched_friends = [friend for friend in friends_list if search_username.lower() in friend["default_image_seed"].lower()]
				if searched_friends:
					friends_values = sorted(searched_friends, key=lambda x: x["default_image_seed"])
			return JsonResponse({"message": "Friends List Returned With Success", "friends": friends_values}, status=200)
		else:
			return JsonResponse({"message": "Empty Friends List", "friends": None}, status=200)
	return JsonResponse({"message": "Error: Invalid User"}, status=401)
