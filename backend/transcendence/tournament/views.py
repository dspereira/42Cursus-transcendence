from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from django.http import JsonResponse
from user_auth.models import User
from .models import Tournament

tournament_model = ModelManager(Tournament)
user_model = ModelManager(User)

from .utils import has_active_tournament
from .utils import get_tournament_players

@login_required
@accepted_methods(["GET"])
def is_tournament_owner(request):
	if not request.GET.get('id'):
		return JsonResponse({"message": f"Error: Invalid query parameter!"}, status=400)
	user = user_model.get(id=request.access_data.sub)
	if not user:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)
	tournament = tournament_model.get(id=request.GET.get('id'))
	if not tournament:
		return JsonResponse({"message": "Error: Invalid Tournament ID!"}, status=400)
	owner_status = False
	if tournament.owner == user:
		owner_status = True
	return JsonResponse({"message": f"Tournament owner status returned with success!", "status": owner_status}, status=200)

@login_required
@accepted_methods(["GET"])
def get_tournament_state(request):
	if not request.GET.get('id'):
		return JsonResponse({"message": f"Error: Invalid query parameter!"}, status=400)
	user = user_model.get(id=request.access_data.sub)
	if not user:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)
	tournament = tournament_model.get(id=request.GET.get('id'))
	if not tournament:
		return JsonResponse({"message": "Error: Invalid Tournament ID!"}, status=400)
	return JsonResponse({"message": f"Tournament status returned with success!", "status": tournament.status}, status=200)

@login_required
@accepted_methods(["GET"])
def tournament_players(request):
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

@login_required
@accepted_methods(["GET"])
def active_tournament(request):
	user = user_model.get(id=request.access_data.sub)
	if not user:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)
	tournament = has_active_tournament(user)
	tournament_data = None
	if tournament:
		tournament_data = {
			"id": tournament.id,
			"name": tournament.name,
			"status": tournament.status,
			"owner": tournament.owner.id
		}
	return JsonResponse({"message": f"Tournament status returned with success!", "tournament": tournament_data}, status=200)
