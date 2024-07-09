from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from custom_decorators import login_required
from django.http import JsonResponse
from user_auth.models import User
from django.views import View
import json

from friendships.friendships import get_friendship
from friendships.friendships import get_friendship_block_status
from friendships.friendships import update_friendship_block_status

user_model = ModelManager(User)

class BlockStatusView(View):

	@method_decorator(login_required)
	def get(self, request):
		user = user_model.get(id=request.access_data.sub)
		if user:
			friend = user_model.get(id=request.GET.get('id'))
			if not friend:
				return JsonResponse({"message": "Error: Invalid Friend ID"}, status=400)

			friendship = get_friendship(user1=user, user2=friend)
			if not friendship:
				return JsonResponse({"message": "Error: Friendship does not exist."}, status=409)

			block = get_friendship_block_status(user=user, friendship=friendship)
			return JsonResponse({
				"message": "Blocked status returned with success.",
				"user_has_blocked": block['user_has_blocked'],
				"friend_has_blocked": block['friend_has_blocked'],
				"status": block['status']
			}, status=200)
		else:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)

	@method_decorator(login_required)
	def post(self, request):
		if request.body:
			req_data = json.loads(request.body)
			user = user_model.get(id=request.access_data.sub)
			if user:
				req_data = json.loads(request.body.decode('utf-8'))
				friend = user_model.get(id=req_data["id"])
				status = True if req_data["status"] == "block" else False
				if friend:
					friendship = get_friendship(user, friend)
					if friendship:
						update_friendship_block_status(friendship, friend, status)
						block = get_friendship_block_status(user=user, friendship=friendship)
						return JsonResponse({"message": f"Block status updated to user {friend.username}",
							"user_has_blocked": block['user_has_blocked'],
							"friend_has_blocked": block['friend_has_blocked'],
							"status": block['status']
						   }, status=200)
					else:
						return JsonResponse({"message": "Error: Can't find friendship"}, status=409)
				else:
					return JsonResponse({"message": "Error: Can't find user to block"}, status=409)
			else:
				return JsonResponse({"message": "Error: Can't find user"}, status=409)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)
