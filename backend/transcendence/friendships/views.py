from custom_decorators import accepted_methods, login_required
from friendships.models import FriendList, BlockList, FriendRequests
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from django.http import JsonResponse
from user_auth.models import User
import json

from friendships.friendships import get_friend_list
from friendships.friendships import get_friend_info
from friendships.friendships import is_already_friend
from friendships.friendships import is_request_already_maded
from friendships.friendships import get_friends_users_list

user_profile_info_model = ModelManager(UserProfileInfo)
friend_requests_model = ModelManager(FriendRequests)
friend_list_model = ModelManager(FriendList)
block_list_model = ModelManager(BlockList)
user_model = ModelManager(User)

@login_required
@accepted_methods(["POST"])
def unblock_user(request):
	if request.body:
		user = user_model.get(id=request.access_data.sub)
		if user:
			req_data = json.loads(request.body.decode('utf-8'))
			blocked_user = user_model.get(id=req_data["blocked_user"])
			if blocked_user:
				unblocke_user = block_list_model.get(user=user, blocked_user=blocked_user)
				if unblocke_user:
					unblocke_user.delete()
					result = {
						"message": "User was unblocked"
					}
				else:
					result = {
						"message": "Error: User already unblocked"
					}
			else:
				result = {
					"message": "Error: Can't find user to unblock"
				}
		else:
			result = {
				"message": "Error: Can't find user"
			}
	else:
		result = {
			"message": "Error: Empty Body"
		}
	return JsonResponse(result, safe=False)

@login_required
@accepted_methods(["POST"])
def block_user(request):
	if request.body:
		user = user_model.get(id=request.access_data.sub)
		if user:
			req_data = json.loads(request.body.decode('utf-8'))
			blocked_user = user_model.get(id=req_data["blocked_user"])
			if blocked_user:
				if not block_list_model.get(user=user, blocked_user=blocked_user):
					block_list_model.create(user=user, blocked_user=blocked_user)
					result = {
						"message": "User was blocked"
					}
				else:
					result = {
						"message": "Error: User already blocked"
					}
			else:
				result = {
					"message": "Error: Can't find user to block"
				}
		else:
			result = {
				"message": "Error: Can't find user"
			}
	else:
		result = {
			"message": "Error: Empty Body"
		}
	return JsonResponse(result, safe=False)

@login_required
@accepted_methods(["GET"])
def get_friends(request):
	user = user_profile_info_model.get(user_id=request.access_data.sub)
	if user:
		friend_list_left = get_friend_list(user.id, "left")
		friend_list_right = get_friend_list(user.id, "right")
		if not friend_list_left and not friend_list_right:
			result = {
			"message": "User has no friends"
		}
		else:
			result = []
			if friend_list_left:
				for friendship in friend_list_left:
					result.append(get_friend_info(friendship, "right"))
			if friend_list_right:
				for friendship in friend_list_right:
					result.append(get_friend_info(friendship, "left"))
	else:
		result = {
			"message": "Error: Can't find user"
		}
	return JsonResponse(result, safe=False)

@login_required
@accepted_methods(["POST"])
def create_friend_request(request):
	if request.body:
		req_data = json.loads(request.body)
		user = user_model.get(id=request.access_data.sub)
		requested_user = user_model.get(username=req_data["requested_user"])
		if user and requested_user:
			if is_already_friend(user1=user, user2=requested_user):
				return JsonResponse({"message": "Error: Friendship Already Exists!"}, status=409)
			if is_request_already_maded(user1=user, user2=requested_user):
				return JsonResponse({"message": "Error: Friendship Already Requested!"}, status=409)
			request = friend_requests_model.create(from_user=user, to_user=requested_user)
			if request:
				result = {
					"message": "Friendhip request sent",
					"request_id": request.id
				}
			else:
				return JsonResponse({"message": "Error: Failed To Create Friend Request!"}, status=409)
		else:
			return JsonResponse({"message": "Error: Invalid User or Requested User!"}, status=409)
	else:
		return JsonResponse({"message": "Error: Empty Body!"}, status=409)
	return JsonResponse(result, status=200)

@login_required
@accepted_methods(["POST"])
def accept_friend_request(request):
	if request.body:
		req_data = json.loads(request.body)
		request_id = req_data["request_id"]
		friend_request = friend_requests_model.get(id=request_id)
		if friend_request:
			friend_list_model.create(user1=friend_request.from_user , user2=friend_request.to_user)
			result = {
				"message": str(friend_request.to_user.username) + " accepted your friend request.",
			}
			friend_request.delete()
		else:
			return JsonResponse({"message": "Error: request_id does not exist"}, status=409)
	else:
		return JsonResponse({"message": "Error: No request_id"}, status=409)
	return JsonResponse(result, status=200)

@login_required
@accepted_methods(["DELETE"])
def decline_friend_request(request):
	if request.body:
		req_data = json.loads(request.body)
		request_id = req_data["request_id"]
		friend_request = friend_requests_model.get(id=request_id)
		if friend_request:
			result = {
				"message": str(friend_request.to_user.username) + " declined your friend request",
			}
			friend_request.delete()
		else:
			return JsonResponse({"message": "Error: request_id does not exist"}, status=409)
	else:
		return JsonResponse({"message": "Error: No request_id"}, status=409)
	return JsonResponse(result)

@login_required
@accepted_methods(["DELETE"])
def remove_friendship(request):
	if request.body:
		req_data = json.loads(request.body)
		user = user_model.get(id=request.access_data.sub)
		friend = user_model.get(username=req_data["friend_username"])

		if user and friend:
			friendship = is_already_friend(user1=user, user2=friend)
			if friendship:
				friendship.delete()
			else:
				return JsonResponse({"message": "Error: Users are not friends!"}, status=409)
		else:
			return JsonResponse({"message": "Error: Invalid User or Friend User!"}, status=409)
	else:
		return JsonResponse({"message": "Error: Empty Body!"}, status=409)
	return JsonResponse({"message": "Friendship removed with success!"}, status=200)

@login_required
@accepted_methods(["GET"])
def search_user_by_name(request):
	
	search_username = request.GET.get('key')
	users_values = None

	if not search_username or search_username == "" or search_username == '""':
		users = user_profile_info_model.all()
		message = f"Search Username is empty!"
	else:
		users = user_profile_info_model.filter(default_image_seed__icontains=search_username)
		message = f"Search Username: [{search_username}]"

	if users:
		users_values = list(users.values('id', 'default_image_seed'))
		users_values = sorted(users_values, key=lambda x: x["default_image_seed"])

	return JsonResponse({"message": message, "users": users_values}, status=200)

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
