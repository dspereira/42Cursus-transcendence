from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from custom_decorators import login_required, check_request_body
from django.http import JsonResponse
from user_auth.models import User
from .models import GameRequests
from django.views import View
import json

from friendships.friendships import is_already_friend
from friendships.friendships import is_friend_blocked

from custom_utils.auth_utils import is_username_bot_username

from custom_utils.requests_utils import REQ_STATUS_DECLINED, REQ_STATUS_ACCEPTED
from custom_utils.requests_utils import update_request_status
from custom_utils.requests_utils import is_valid_request
from custom_utils.requests_utils import set_exp_time
from .utils import has_already_valid_game_request
from .utils import get_game_requests_list
from .utils import has_already_games_accepted
from .utils import cancel_other_invitations
from .utils import get_games_list

from .Lobby import Lobby, lobby_dict

game_requests_model = ModelManager(GameRequests)
user_model = ModelManager(User)

class GameRequestView(View):

	@method_decorator(login_required)
	def get(self, request):
		user = user_model.get(id=request.access_data.sub)
		if user:
			requests_list = get_game_requests_list(user=user)
			return JsonResponse({"message": f"Game request list retrieved with success.", "requests_list": requests_list}, status=200)
		else:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)

	@method_decorator(login_required)
	@method_decorator(check_request_body(["invites_list"]))
	def post(self, request):
		if request.body:
			req_data = json.loads(request.body)
			user = user_model.get(id=request.access_data.sub)
			invites_list = req_data["invites_list"]
			if user:
				if not len(invites_list):
					return JsonResponse({"message": f"Error: Please invite players to play!",}, status=409)
				if has_already_games_accepted(user=user):
					return JsonResponse({"message": f"Error: User is already playing a game!",}, status=409)
				lobby_id = str(user.id)
				if lobby_id in lobby_dict and lobby_dict[lobby_id]:
					lobby_dict[lobby_id].reset()
				else:
					lobby_dict[lobby_id] = Lobby(user.id)
				if not lobby_dict[lobby_id]:
					return JsonResponse({"message": f"Error: Failed to create game lobby!",}, status=409)
				for friend_id in invites_list:
					user2 = user_model.get(id=friend_id)
					if not user2 or is_username_bot_username(user2.username):
						return JsonResponse({"message": "Error: Invalid User!"}, status=409)
					if is_already_friend(user1=user, user2=user2):
						if is_friend_blocked(user1=user, user2=user2):
							return JsonResponse({"message": f"Error: Friend is blocked!",}, status=409)
						if has_already_valid_game_request(user1=user, user2=user2):
							return JsonResponse({"message": f"Error: Has already game request!",}, status=409)
						game_request = game_requests_model.create(from_user=user, to_user=user2)
						set_exp_time(request=game_request)
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
	@method_decorator(check_request_body(["id"]))
	def delete(self, request):
		if request.body:
			req_data = json.loads(request.body)
			game_req_id = req_data['id']
			if game_req_id:
				game_request = game_requests_model.get(id=game_req_id)
				if game_request:
					update_request_status(request=game_request, new_status=REQ_STATUS_DECLINED)
					return JsonResponse({"message": f"Request {game_req_id} new status = decline"}, status=200)
			return JsonResponse({"message": "Error: Invalid Game Request ID!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)

	@method_decorator(login_required)
	@method_decorator(check_request_body(["id"]))
	def put(self, request):
		if request.body:
			req_data = json.loads(request.body)
			user = user_model.get(id=request.access_data.sub)
			games_req = game_requests_model.get(id=req_data["id"])
			if user:
				if not games_req or games_req.to_user.id != user.id:
					return JsonResponse({"message": "Error: Invalid game request ID!"}, status=409)
				if not has_already_games_accepted(user=user):
					lobby_id = str(games_req.from_user.id)
					lobby = lobby_dict[lobby_id]
					if not lobby.is_full():
						if not is_valid_request(games_req):
							return JsonResponse({"message": "Error: Invalid Request!"}, status=409) 
						update_request_status(request=games_req, new_status=REQ_STATUS_ACCEPTED)
						lobby.set_user_2_id(games_req.to_user.id)
						return JsonResponse({"message": "Invite accepted with success!", "lobby_id": games_req.from_user.id}, status=200) 
					else:
						return JsonResponse({"message": "Error: Game lobby is full!"}, status=409)
				else:
					return JsonResponse({"message": "Error: Currently playing a game!"}, status=409)
			else:
				return JsonResponse({"message": "Error: Invalid User!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)
