from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from friendships.models import FriendRequests
from custom_decorators import login_required
from user_profile.aux import get_image_url
from django.http import JsonResponse
from user_auth.models import User
from django.views import View
import json

from friendships.friendships import is_already_friend
from friendships.friendships import is_request_already_maded
from friendships.friendships import get_friends_request_list
from friendships.friendships import get_friend_request

user_profile_info_model = ModelManager(UserProfileInfo)
friend_requests_model = ModelManager(FriendRequests)
user_model = ModelManager(User)

class FriendRequestView(View):

	@method_decorator(login_required)
	def get(self, request):
		user = user_model.get(id=request.access_data.sub)
		if user:
			friend_requests_ids = get_friends_request_list(user=user, own=False)
			friend_requests = []
			if friend_requests_ids:
				for req in friend_requests_ids:
					friend = user_profile_info_model.get(id=req['from_user'])
					if friend:
						friend_requests.append({
							"request_id": req['id'],
							"id": friend.id,
							"username": friend.default_image_seed,
							"image": get_image_url(user=friend)
						})
			if not len(friend_requests):
				friend_requests = None
			return JsonResponse({"message": "Request List Get With Success", "friend_requests": friend_requests}, status=200)
		else:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)

	@method_decorator(login_required)
	def post(self, request):
		if request.body:
			req_data = json.loads(request.body)
			user = user_model.get(id=request.access_data.sub)
			requested_user = user_model.get(id=req_data["requested_user"])
			if user and requested_user:
				if is_already_friend(user1=user, user2=requested_user):
					return JsonResponse({"message": "Error: Friendship Already Exists!"}, status=409)
				if is_request_already_maded(user1=user, user2=requested_user):
					return JsonResponse({"message": "Error: Friendship Already Requested!"}, status=409)
				friend_request = friend_requests_model.create(from_user=user, to_user=requested_user)
				if friend_request:
					return JsonResponse({"message": "Friendhip request sent", "request_id": friend_request.id}, status=201)
				else:
					return JsonResponse({"message": "Error: Failed To Create Friend Request!"}, status=500)
			else:
				return JsonResponse({"message": "Error: Invalid User or Requested User!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)

	@method_decorator(login_required)
	def delete(self, request):
		if request.body:
			req_data = json.loads(request.body)
			user = user_model.get(id=request.access_data.sub)
			request_id = req_data["request_id"]
			if user and request_id:
				friend_request =  get_friend_request(user=user, request_id=request_id)
				if friend_request:
					friend_request.delete()
					return JsonResponse({"message": "Friend request deleted with success"}, status=200)
				else:
					return JsonResponse({"message": "Friend request does not exist"}, status=404)
			else:
				return JsonResponse({"message": "Error: Invalid User or Requested User!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)
