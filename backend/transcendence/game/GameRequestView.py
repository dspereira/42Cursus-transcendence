from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from custom_decorators import login_required
from django.http import JsonResponse
from user_auth.models import User
from .models import GameRequests
from django.views import View
import json

from friendships.friendships import is_already_friend

from .utils import has_already_valid_game_request
from .utils import set_exp_time
from .utils import get_game_requests_list
from .utils import update_game_request_status

game_requests_model = ModelManager(GameRequests)
user_model = ModelManager(User)

class GameRequestView(View):

	# @method_decorator(login_required)
	def get(self, request):
		# user = user_model.get(id=request.access_data.sub)
		user = user_model.get(id=request.GET.get('user'))
		if user:
			requests_list = get_game_requests_list(user=user)
			return JsonResponse({"message": f"Game request list retrieved with success.", "requests_list": requests_list}, status=200)
		else:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)

	# @method_decorator(login_required)
	def post(self, request):
		if request.body:
			req_data = json.loads(request.body)
			# user = user_model.get(id=request.access_data.sub)
			user = user_model.get(id=req_data["user"])
			friend = user_model.get(id=req_data["id"])
			if user and friend and user.id != friend.id:
				if is_already_friend(user1=user, user2=friend):
					if has_already_valid_game_request(user1=user, user2=friend):
						return JsonResponse({"message": f"Error: Has already game request!",}, status=409)
					game_request = game_requests_model.create(from_user=user, to_user=friend)
					set_exp_time(game_request=game_request)
					if game_request:
						return JsonResponse({"message": f"All Good!",
								"method": f"{request.method}",
								"user": f"{user}",
								"friend": f"{friend}",
								"game_request": f"{game_request}"
						}, status=201)
					else:
						return JsonResponse({"message": f"Error: Failed to create game request in DataBase",}, status=409)
				else:
					return JsonResponse({"message": "Error: Users are not friends!"}, status=409)
			else:
				return JsonResponse({"message": "Error: Invalid User, Requested Friend!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)

	# @method_decorator(login_required)
	def patch(self, request):
		if request.body:
			req_data = json.loads(request.body)
			game_req_id = req_data['id']
			if game_req_id:
				game_request = game_requests_model.get(id=game_req_id)
				if game_request:
					update_game_request_status(game_request=game_request, new_status="decline")
					return JsonResponse({"message": f"Request {game_req_id} new status = decline"}, status=200)
			return JsonResponse({"message": "Error: Invalid Game Request ID!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)

	# @method_decorator(login_required)
	def delete(self, request):
		if request.body:
			req_data = json.loads(request.body)
			game_req_id = req_data['id']
			if game_req_id:
				game_request = game_requests_model.get(id=game_req_id)
				if game_request:
					game_request.delete()
					return JsonResponse({"message": f"Deleted request with id = {game_req_id}"}, status=200)
				else:
					return JsonResponse({"message": "Error: Invalid Game Request ID!"}, status=400)
			else:
				counter = 0
				game_requests = game_requests_model.all()
				if game_requests:
					for req in game_requests:
						req.delete()
						counter += 1
				return JsonResponse({"message": f"Deleted {counter} game requests!"}, status=200)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)
