from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from django.http import JsonResponse
from user_auth.models import User
from .models import Tournament, TournamentRequests
import json

from friendships.friendships import get_friend_list, get_friends_users_list

from custom_utils.requests_utils import REQ_STATUS_ABORTED

from .utils import get_tournament_user_requests_list
from .utils import has_active_tournament
from .utils import get_tournament_players
from .utils import is_user_inside_list

tournament_requests_model = ModelManager(TournamentRequests)
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

@login_required
@accepted_methods(["GET"])
def friend_list(request):
	user = user_model.get(id=request.access_data.sub)
	if not user:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)
	search_username = request.GET.get('key')
	tournament = has_active_tournament(user)
	if not tournament or tournament.owner != user:
		return JsonResponse({"message": "Error: User is not the host of an tournament!"}, status=400)
	new_friend_list = []
	friends_list = get_friends_users_list(get_friend_list(user), user.id)
	tournament_requests = get_tournament_user_requests_list(tournament)
	current_tournament_players = get_tournament_players(tournament)
	for friend in friends_list:
		has_request_flag = False
		if is_user_inside_list(tournament_requests, friend['id']) or is_user_inside_list(current_tournament_players, friend['id']):
			has_request_flag = True
		elif search_username and not friend['username'].startswith(search_username):
			has_request_flag = True
		if not has_request_flag:
			new_friend_list.append(friend)
	return JsonResponse({"message": f"Friend list returned with success!", "friends": new_friend_list}, status=200)

@login_required
@accepted_methods(["GET"])
def invited_users_to_tournament(request):
	user = user_model.get(id=request.access_data.sub)
	if not user:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)
	tournament = has_active_tournament(user)
	if not tournament or tournament.owner != user:
		return JsonResponse({"message": "Error: User is not the host of an tournament!"}, status=400)
	invited_users = get_tournament_user_requests_list(tournament)
	return JsonResponse({"message": f"Invited Users list returned with success!", "invited_users": invited_users}, status=200)

@login_required
@accepted_methods(["DELETE"])
def cancel_invite(request):
	if not request.body:
		return JsonResponse({"message": "Error: Empty Body!"}, status=400)
	req_data = json.loads(request.body)
	if not req_data['id']:
		return JsonResponse({"message": "Error: Invalid invite ID!"}, status=400)
	invite = tournament_requests_model.get(id=req_data['id'])
	if not invite:
		return JsonResponse({"message": "Error: Tournament invite does not exist!"}, status=409)
	user = user_model.get(id=request.access_data.sub)
	if not user:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)
	tournament = has_active_tournament(user)
	if not tournament or tournament.owner != user:
		return JsonResponse({"message": "Error: User is not the host of an tournament!"}, status=409)
	if invite.tournament != tournament:
		return JsonResponse({"message": "Error: Tournament invite does not belong to your current Tournament!"}, status=409)
	invite.status = REQ_STATUS_ABORTED
	invite.save()
	return JsonResponse({"message": f"Invite canceled with success!"}, status=200)
