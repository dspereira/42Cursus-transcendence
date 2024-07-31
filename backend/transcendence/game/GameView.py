from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from custom_decorators import login_required
from django.http import JsonResponse
from user_auth.models import User
from .models import GameRequests, Games
from django.views import View
import json

from .utils import GAME_REQ_STATUS_ACCEPTED
from .utils import update_game_request_status
from .utils import get_games_list
from .utils import has_already_games_accepted
from .utils import cancel_other_invitations

from .Lobby import lobby_dict

game_requests_model = ModelManager(GameRequests)
user_model = ModelManager(User)

class GameView(View):

	@method_decorator(login_required)
	def get(self, request):
		user = user_model.get(id=request.access_data.sub)
		# user = user_model.get(id=request.GET.get('user'))
		if user:
			games_list = get_games_list(user=user)
			return JsonResponse({"message": f"Game request list retrieved with success.", "games_list": games_list}, status=200)
		else:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)

	@method_decorator(login_required)
	def update(self, request):
		if request.body:
			req_data = json.loads(request.body)
			user = user_model.get(id=request.access_data.sub)
			games_req = game_requests_model.get(id=req_data["id"])
			if user:
				if not games_req or games_req.to_user.id != user.id:
					return JsonResponse({"message": "Error: Invalid game request ID!"}, status=409)
				if not has_already_games_accepted(user=user):
					update_game_request_status(game_request=games_req, new_status=GAME_REQ_STATUS_ACCEPTED)
					cancel_other_invitations(user=games_req.from_user)
					lobby = lobby_dict[games_req.from_user.id]
					lobby.set_user_2_id(games_req.to_user.id)
					return JsonResponse({"message": "Invite accepted with success!", "lobby_id": games_req.from_user.id}, status=200) 
				else:
					return JsonResponse({"message": "Error: Currently playing a game!"}, status=409)
			else:
				return JsonResponse({"message": "Error: Invalid User!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)
