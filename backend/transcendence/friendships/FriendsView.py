from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from custom_decorators import login_required
from friendships.models import FriendRequests
from django.http import JsonResponse
from user_auth.models import User
from django.views import View
import json

from friendships.friendships import is_already_friend
from friendships.friendships import get_friends_users_list
from friendships.friendships import get_friend_list

friend_requests_model = ModelManager(FriendRequests)
user_model = ModelManager(User)

class FriendsView(View):

	@method_decorator(login_required)
	def get(self, request):
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

	@method_decorator(login_required)
	def post(self, request):
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

	@method_decorator(login_required)
	def delete(self, request):
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
