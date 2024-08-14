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

from .utils import has_already_valid_tournament_request
from .utils import get_tournament_list
from .utils import update_tournament_status

from .consts import TOURNAMENT_STATUS_ABORTED

class TournamentView(View):

	@method_decorator(login_required)
	def get(self, request):
		user = user_model.get(id=request.access_data.sub)
		if user:
			tournaments_list = get_tournament_list(user=user)
			return JsonResponse({"message": f"Tournament list retrieved with success.", "tournaments_list": tournaments_list}, status=200)
		else:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)

	@method_decorator(login_required)
	def post(self, request):
		user = user_model.get(id=request.access_data.sub)
		if user:
			new_tournament_name = f'{user.username}\'s Tournament'
			new_tournament = tournament_model.create(name=new_tournament_name)
			if not new_tournament:
				return JsonResponse({"message": f"Error: Failed to create Tournament.",}, status=409)
			return JsonResponse({"message": f"Tournament Created With Success!", "tournament_id": new_tournament.id}, status=201)
		else:
			return JsonResponse({"message": "Error: Invalid User, Requested Friend!"}, status=400)

	@method_decorator(login_required)
	def delete(self, request):
		if request.body:
			req_data = json.loads(request.body)
			tournament_id = req_data['id']
			if tournament_id:
				tournament = tournament_model.get(id=tournament_id)
				if tournament:
					update_tournament_status(tournament=tournament, new_status=TOURNAMENT_STATUS_ABORTED)
					return JsonResponse({"message": f"Tournament {tournament_id} new status = decline"}, status=200)
			return JsonResponse({"message": "Error: Invalid Tournament ID!"}, status=400)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)

	@method_decorator(login_required)
	def put(self, request):
		if request.body:
			req_data = json.loads(request.body)
			user = user_model.get(id=request.access_data.sub)
			tournament = tournament_model.get(id=req_data["id"])
			new_tournament_name = req_data["new_name"].strip()
			if not tournament:
					return JsonResponse({"message": "Error: Invalid tournament ID!"}, status=409)
			if not new_tournament_name:
				return JsonResponse({"message": "Invalid new Tournament Name!"}, status=409)
			if not user:
				return JsonResponse({"message": "Error: Invalid User!"}, status=400)
			tournament.name = new_tournament_name
			tournament.save()
			return JsonResponse({"message": "Tournament name changed with success!"}, status=200)
		else:
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)
