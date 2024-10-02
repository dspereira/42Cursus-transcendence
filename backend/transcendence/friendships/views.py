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
from friendships.friendships import remove_users_with_friends_request
from friendships.friendships import get_users_info
from friendships.friendships import is_already_friend
from friendships.friendships import number_pending_game_requests

user_profile_info_model = ModelManager(UserProfileInfo)
friend_requests_model = ModelManager(FriendRequests)
friend_list_model = ModelManager(FriendList)
user_model = ModelManager(User)

@login_required
@accepted_methods(["GET"])
def number_friend_requests(request):
	user = user_model.get(id=request.access_data.sub)
	if user:
		n_requests = number_pending_game_requests(user)
		return JsonResponse({"message": "Number pending friend requests returned with success.", "number_friend_requests": n_requests}, status=200)
	return JsonResponse({"message": "Error: Invalid User"}, status=401)

@login_required
@accepted_methods(["GET"])
def search_user_by_name(request):
	user = user_model.get(id=request.access_data.sub)
	if not user:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)
	search_username = request.GET.get('key')
	users_values = None
	result_users = None
	users = None
	if not search_username or search_username == "" or search_username == '""':
		users = user_profile_info_model.all()
		message = f"Search Username is empty!"
	elif len(search_username) > 15:
		message = f"Invalid username!" 
	else:
		users = user_profile_info_model.filter(user__username__istartswith=search_username)
		if users:
			users = users.exclude(user__username="BlitzPong")
		message = f"Search Username: [{search_username}]"
	if users:
		users_values = get_users_info(users=users)
		result_users = remove_user_and_friends_from_users_list(user_id=user.id, users_list=users_values)
		remove_users_with_friends_request(user=user, users_list=result_users)
		friends_requests_list = get_friends_request_list(user=user, own=True)
		check_if_friend_request(users_list=result_users, requests_list=friends_requests_list)
		result_users = sorted(result_users, key=lambda x: x["username"])
		if not len(result_users):
			result_users = None
	return JsonResponse({"message": message, "users": result_users}, status=200)

@login_required
@accepted_methods(["GET"])
def chat_list(request):
	user = user_model.get(id=request.access_data.sub)
	if user:
		friends_list = get_friends_users_list(friends=get_friend_list(user=user), user_id=user.id, include_bot=True, include_blocked=True)
		if friends_list:
			return JsonResponse({"message": "Friends List Returned With Success", "friends": friends_list}, status=200)
		else:
			return JsonResponse({"message": "Empty Friends List", "friends": None}, status=200)
	return JsonResponse({"message": "Error: Invalid User"}, status=401)
