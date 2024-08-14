from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from django.http import JsonResponse
from user_auth.models import User
from .models import Tournament

tournament_model = ModelManager(Tournament)
user_model = ModelManager(User)

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
