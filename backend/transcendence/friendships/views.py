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

user_profile_info_model = ModelManager(UserProfileInfo)
friend_requests_model = ModelManager(FriendRequests)
friend_list_model = ModelManager(FriendList)
user_model = ModelManager(User)

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
		users_values = get_users_info(users=users)
		result_users = remove_user_and_friends_from_users_list(user_id=user.id, users_list=users_values)
		remove_users_with_friends_request(user=user, users_list=result_users)
		friends_requests_list = get_friends_request_list(user=user, own=True)
		check_if_friend_request(users_list=result_users, requests_list=friends_requests_list)
		result_users = sorted(result_users, key=lambda x: x["username"])
	return JsonResponse({"message": message, "users": result_users}, status=200)

@login_required
@accepted_methods(["GET"])
def chat_list(request):
	user = user_model.get(id=request.access_data.sub)
	if user:
		friends_list = get_friends_users_list(friends=get_friend_list(user=user), user_id=user.id)
		if friends_list:
			return JsonResponse({"message": "Friends List Returned With Success", "friends": friends_list}, status=200)
		else:
			return JsonResponse({"message": "Empty Friends List", "friends": None}, status=200)
	return JsonResponse({"message": "Error: Invalid User"}, status=401)

@login_required
@accepted_methods(["GET"])
def info(request):
	if not request.GET.get('id') or not str(request.GET.get('id')).isdigit():
		return JsonResponse({"message": "Error: Bad Request"}, status=400)
	user = user_model.get(id=request.access_data.sub)
	if user:
		friend = user_model.get(id=request.GET['id'])
		if not friend:
			return JsonResponse({"message": "Friend does not exist!"}, status=409)
		if not is_already_friend(user, friend):
			return JsonResponse({"message": "Users are not friends!"}, status=409)
		friend_info = get_users_info(user_profile_info_model.get(user=friend))
		return JsonResponse({"message": "Friend info Returned With Success", "friend_info": friend_info}, status=200)
	return JsonResponse({"message": "Error: Invalid User"}, status=401)
