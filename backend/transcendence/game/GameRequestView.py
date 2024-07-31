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
from .utils import has_already_games_accepted
from .utils import GAME_REQ_STATUS_DECLINED

from .Lobby import Lobby, lobby_dict

game_requests_model = ModelManager(GameRequests)
user_model = ModelManager(User)

def get_test_requests_list():
	requests_list = [
		{
			"req_id": 1,
			"id": 1,
			"username": "user_1",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=user_1" 
		},
		{
			"req_id": 2,
			"id": 2,
			"username": "user_2",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=user_2" 
		},
		{
			"req_id": 3,
			"id": 3,
			"username": "user_3",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=user_3" 
		},
		{
			"req_id": 4,
			"id": 4,
			"username": "user_4",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=user_4" 
		},
		{
			"req_id": 5,
			"id": 5,
			"username": "user_5",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=user_5"
		},
		{
			"req_id": 6,
			"id": 6,
			"username": "user_2",
			"image": "https://api.dicebear.com/8.x/bottts/svg?seed=user_6" 
		}
	]
	return requests_list

class GameRequestView(View):

	@method_decorator(login_required)
	def get(self, request):
		user = user_model.get(id=request.access_data.sub)
		if user:
			# requests_list = get_game_requests_list(user=user)
			requests_list = get_test_requests_list()
			return JsonResponse({"message": f"Game request list retrieved with success.", "requests_list": requests_list}, status=200)
		else:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)

	@method_decorator(login_required)
	def post(self, request):
		if request.body:
			req_data = json.loads(request.body)
			user = user_model.get(id=request.access_data.sub)
			invites_list = req_data["invites_list"]
			if user:
				if has_already_games_accepted(user=user):
					return JsonResponse({"message": f"Error: User is already playing a game!",}, status=409)
				lobby_dict[user.id] = Lobby(user.id)
				if not lobby_dict[user.id]:
					return JsonResponse({"message": f"Error: Failed to create game lobby!",}, status=409)
				for friend_id in invites_list:
					user2 = user_model.get(id=friend_id)
					if is_already_friend(user1=user, user2=user2):
						if has_already_valid_game_request(user1=user, user2=user2):
							return JsonResponse({"message": f"Error: Has already game request!",}, status=409)
						game_request = game_requests_model.create(from_user=user, to_user=user2, game_id=new_game.id)
						set_exp_time(game_request=game_request)
						if not game_request:
							return JsonResponse({"message": f"Error: Failed to create game request in DataBase",}, status=409)
					else:
						return JsonResponse({"message": "Error: Users are not friends!"}, status=409)
				return JsonResponse({"message": f"Game Requested Created With Success!"}, status=201)
			else:
				return JsonResponse({"message": "Error: Invalid User, Requested Friend!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)

	@method_decorator(login_required)
	def patch(self, request):
		if request.body:
			req_data = json.loads(request.body)
			game_req_id = req_data['id']
			if game_req_id:
				game_request = game_requests_model.get(id=game_req_id)
				if game_request:
					update_game_request_status(game_request=game_request, new_status=GAME_REQ_STATUS_DECLINED)
					return JsonResponse({"message": f"Request {game_req_id} new status = decline"}, status=200)
			return JsonResponse({"message": "Error: Invalid Game Request ID!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)
