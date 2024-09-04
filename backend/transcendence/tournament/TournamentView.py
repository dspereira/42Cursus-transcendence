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

from .utils import has_active_tournament
from .utils import get_tournament_list
from .utils import update_tournament_status
from .utils import add_player_to_tournament
from .utils import invalidate_active_tournament_invites

from .consts import TOURNAMENT_STATUS_ABORTED
from .consts import TOURNAMENT_STATUS_ACTIVE
from .consts import TOURNAMENT_STATUS_CREATED

class TournamentView(View):

	@method_decorator(login_required)
	def get(self, request):
		username = request.GET.get('username')
		if username:
			user = user_model.get(username=username)
		else:
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
			if has_active_tournament(user):
				return JsonResponse({"message": f"Error: User has already an active Tournament.",}, status=409)
			new_tournament_name = f'{user.username}\'s Tournament'
			new_tournament = tournament_model.create(name=new_tournament_name, owner=user)
			if not new_tournament:
				return JsonResponse({"message": f"Error: Failed to create Tournament.",}, status=409)
			if not add_player_to_tournament(new_tournament, user):
				new_tournament.delete()
				return JsonResponse({"message": f"Error: Failed to add player to Tournament.",}, status=409)
			return JsonResponse({"message": f"Tournament Created With Success!", "tournament_id": new_tournament.id}, status=201)
		else:
			return JsonResponse({"message": "Error: Invalid User, Requested Friend!"}, status=400)

	@method_decorator(login_required)
	def delete(self, request):
		user = user_model.get(id=request.access_data.sub)
		if not user:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)
		if not request.GET.get('id'):
			return JsonResponse({"message": "Error: Invalid request ID!"}, status=409)
		tournament_id = request.GET.get('id')
		if tournament_id:
			tournament = tournament_model.get(id=tournament_id)
			if tournament and tournament.owner == user:
				if tournament.status == TOURNAMENT_STATUS_CREATED:
					invalidate_active_tournament_invites(tournament)
				update_tournament_status(tournament=tournament, new_status=TOURNAMENT_STATUS_ABORTED)
				return JsonResponse({"message": f"Tournament {tournament_id} new status -> {tournament.status}"}, status=200)
		return JsonResponse({"message": "Error: Invalid Tournament ID!"}, status=409)

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
