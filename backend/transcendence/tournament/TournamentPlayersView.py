from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from custom_decorators import login_required
from django.http import JsonResponse
from user_auth.models import User
from .models import Tournament
from django.views import View
import json

tournament_model = ModelManager(Tournament)
user_model = ModelManager(User)

from .utils import get_tournament_players
from .utils import has_active_tournament
from .utils import delete_single_tournament_player

class TournamentPlayersView(View):
	@method_decorator(login_required)
	def get(self, request):
		if not request.GET.get('id'):
			return JsonResponse({"message": f"Error: Invalid query parameter!"}, status=400)
		user = user_model.get(id=request.access_data.sub)
		if not user:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)
		tournament = tournament_model.get(id=request.GET.get('id'))
		if not tournament:
			return JsonResponse({"message": "Error: Invalid Tournament ID!"}, status=400)
		tournament_players_list = get_tournament_players(tournament)
		return JsonResponse({"message": f"Tournament players returned with success!", "players": tournament_players_list}, status=200)

	@method_decorator(login_required)
	def delete(self, request):
		if not request.DELETE.get('id'):
			return JsonResponse({"message": "Error: Empty Body!"}, status=400)
		user = user_model.get(id=request.access_data.sub)
		if not user:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)
		tournament = has_active_tournament(user)
		if not tournament or tournament.owner == user:
			return JsonResponse({"message": "Error: User is the host of an tournament!"}, status=409)
		if not delete_single_tournament_player(user, tournament):
			return JsonResponse({"message": "Error: Failed to leave the tournament!"}, status=409)
		return JsonResponse({"message": "Tournament left with success!"}, status=409)
