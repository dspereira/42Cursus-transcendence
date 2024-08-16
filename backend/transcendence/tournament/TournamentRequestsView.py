from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from custom_decorators import login_required
from django.http import JsonResponse
from user_auth.models import User
from .models import TournamentRequests, Tournament, TournamentPlayers
from django.views import View
import json

from friendships.friendships import is_already_friend

tournament_requests_model = ModelManager(TournamentRequests)
tournament_player_model = ModelManager(TournamentPlayers)
tournament_model = ModelManager(Tournament)
user_model = ModelManager(User)

from custom_utils.requests_utils import REQ_STATUS_DECLINED, REQ_STATUS_ACCEPTED
from custom_utils.requests_utils import update_request_status
from custom_utils.requests_utils import set_exp_time

from .utils import has_already_valid_tournament_request
from .utils import get_tournament_requests_list

class TournamentInvitesView(View):

	@method_decorator(login_required)
	def get(self, request):
		user = user_model.get(id=request.access_data.sub)
		if user:
			requests_list = get_tournament_requests_list(user=user)
			return JsonResponse({"message": f"Tournament request list retrieved with success.", "requests_list": requests_list}, status=200)
		else:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)

	@method_decorator(login_required)
	def post(self, request):
		if request.body:
			req_data = json.loads(request.body)
			user = user_model.get(id=request.access_data.sub)
			if not req_data["invites_list"] or not req_data["id"]:
				return JsonResponse({"message": "Error: Missing body information!"}, status=400)
			invites_list = req_data["invites_list"]
			tournament_id = req_data["id"]
			if user:
				tournament = tournament_model.get(id=tournament_id)
				if tournament:
					return JsonResponse({"message": f"Error: Failed to create Tournament.",}, status=409)
				for friend_id in invites_list:
					user2 = user_model.get(id=friend_id)
					if is_already_friend(user1=user, user2=user2):
						tournament_request = tournament_requests_model.create(from_user=user, to_user=user2, tournament=tournament)
						set_exp_time(request=tournament_request)
						if not tournament_request:
							return JsonResponse({"message": f"Error: Failed to create tournament request in DataBase",}, status=409)
					else:
						return JsonResponse({"message": "Error: Users are not friends!"}, status=409)
				return JsonResponse({"message": f"Game Requested Created With Success!"}, status=201)
			else:
				return JsonResponse({"message": "Error: Invalid User, Requested Friend!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)

	@method_decorator(login_required)
	def delete(self, request):
		if request.body:
			req_data = json.loads(request.body)
			tournament_req_id = req_data['id']
			if tournament_req_id:
				tournament_request = tournament_requests_model.get(id=tournament_req_id)
				if tournament_request:
					update_request_status(request=tournament_request, new_status=REQ_STATUS_DECLINED)
					return JsonResponse({"message": f"Request {tournament_req_id} new status = decline"}, status=200)
			return JsonResponse({"message": "Error: Invalid Request ID!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)

	@method_decorator(login_required)
	def put(self, request):
		if request.body:
			req_data = json.loads(request.body)
			user = user_model.get(id=request.access_data.sub)
			tournament_req = tournament_requests_model.get(id=req_data["id"])
			if user:
				if not tournament_req or tournament_req.to_user.id != user.id:
					return JsonResponse({"message": "Error: Invalid request ID!"}, status=409)
				if not has_already_valid_tournament_request(user=user):
					update_request_status(request=tournament_req, new_status=REQ_STATUS_ACCEPTED)
					new_tournament_player = tournament_player_model.create(user=user, tournament=tournament_req.tournament)
					if not new_tournament_player:
						return JsonResponse({"message": "Error: Failed to create tournament player!"}, status=409)
					return JsonResponse({"message": "Invite accepted with success!"}, status=200)
				else:
					return JsonResponse({"message": "Error: Currently playing a tournament!"}, status=409)
			else:
				return JsonResponse({"message": "Error: Invalid User!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)
