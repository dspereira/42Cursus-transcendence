from friendships.models import FriendList, FriendRequests
from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from custom_decorators import login_required
from live_chat.models import ChatRoom
from django.http import JsonResponse
from user_auth.models import User
from django.views import View
import json

from friendships.friendships import is_already_friend
from friendships.friendships import get_friends_users_list
from friendships.friendships import get_friend_list
from friendships.friendships import delete_friend_chatroom

from custom_utils.auth_utils import is_username_bot_username

friend_requests_model = ModelManager(FriendRequests)
friend_list_model = ModelManager(FriendList)
chatroom_model = ModelManager(ChatRoom)
user_model = ModelManager(User)

class FriendsView(View):

	@method_decorator(login_required)
	def get(self, request):
		search_username = request.GET.get('key')
		friends_values = None
		user = user_model.get(id=request.access_data.sub)
		if user:
			friends_list = get_friends_users_list(friends=get_friend_list(user=user), user_id=user.id, include_bot=False)
			if friends_list:
				if not search_username or search_username == "" or search_username == '""':
					friends_values = sorted(friends_list, key=lambda x: x["username"])
				elif len(search_username) > 15:
					friends_values = []
				else:
					searched_friends = [friend for friend in friends_list if friend["username"].lower().startswith(search_username.lower())]
					if searched_friends:
						friends_values = sorted(searched_friends, key=lambda x: x["username"])
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
				friendship = friend_list_model.create(user1=friend_request.from_user , user2=friend_request.to_user)
				if friendship:
					friend_request.delete()
					chat_name = str(friend_request.from_user.id) + "_" + str(friend_request.to_user.id)
					chatroom = chatroom_model.create(name=chat_name)
					if chatroom:
						return JsonResponse({"message": str(friend_request.to_user.username) + " accepted your friend request."}, status=201)
					else:
						friendship.delete()
						return JsonResponse({"message": "Error: Failed the criation of friend."}, status=409)
				else:
					return JsonResponse({"message": "Error: Failed the criation of friend."}, status=409)
			else:
				return JsonResponse({"message": "Error: request_id does not exist"}, status=409)
		else:
			return JsonResponse({"message": "Error: No request_id"}, status=409)

	@method_decorator(login_required)
	def delete(self, request):
		if request.body:
			req_data = json.loads(request.body)
			user = user_model.get(id=request.access_data.sub)
			friend = user_model.get(id=req_data["friend_id"])
			if user and friend and not is_username_bot_username(friend.username):
				friendship = is_already_friend(user1=user, user2=friend)
				if friendship:
					friendship.delete()
					delete_friend_chatroom(user, friend)
				else:
					return JsonResponse({"message": "Error: Users are not friends!"}, status=409)
			else:
				return JsonResponse({"message": "Error: Invalid User or Friend User!"}, status=409)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=409)
		return JsonResponse({"message": "Friendship removed with success!"}, status=200)
