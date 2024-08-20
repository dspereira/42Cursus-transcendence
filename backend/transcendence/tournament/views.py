from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from django.http import JsonResponse
from user_auth.models import User
from .models import Tournament, TournamentRequests
import json

from friendships.friendships import get_friend_list, get_friends_users_list

from custom_utils.requests_utils import REQ_STATUS_ABORTED
from custom_utils.requests_utils import update_request_status

from .utils import get_tournament_user_requests_list
from .utils import has_active_tournament
from .utils import get_tournament_players
from .utils import is_user_inside_list
from .utils import create_tournament_games
from .utils import update_tournament_status
from .utils import get_tournament_games_list
from .consts import TOURNAMENT_STATUS_ACTIVE

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
	update_request_status(invite, REQ_STATUS_ABORTED)
	return JsonResponse({"message": f"Invite canceled with success!"}, status=200)

@login_required
@accepted_methods(["POST"])
def start_tournament(request):
	if not request.body:
		return JsonResponse({"message": "Error: Empty Body!"}, status=400)
	req_data = json.loads(request.body)
	if not req_data.get('id'):
		return JsonResponse({"message": "Error: Invalid tournament ID!"}, status=400)
	user = user_model.get(id=request.access_data.sub)
	if not user:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)
	tournament = tournament_model.get(id=req_data['id'])
	if not tournament or tournament.owner != user:
		return JsonResponse({"message": "Error: User is not the host of an tournament!"}, status=409)
	if tournament.status == TOURNAMENT_STATUS_ACTIVE:
		return JsonResponse({"message": "Error: Tournament already started!"}, status=409)
	if not tournament.nbr_players == tournament.nbr_max_players:
		return JsonResponse({"message": "Error: Invalid number of players to start the tournament!"}, status=409)
	if not create_tournament_games(tournament):
		return JsonResponse({"message": "Error: Failed to create tournament games!"}, status=409)
	update_tournament_status(tournament, TOURNAMENT_STATUS_ACTIVE)
	return JsonResponse({"message": f"Tournament started with success!"}, status=200)

@login_required
@accepted_methods(["GET"])
def games_list(request):
	tournament_id = request.GET.get('id')
	if not tournament_id:
		return JsonResponse({"message": "Error: Invalid tournament id!"}, status=400)
	user = user_model.get(id=request.access_data.sub)
	if not user:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)
	tournament = tournament_model.get(id=tournament_id)
	if not tournament or tournament.owner != user:
		return JsonResponse({"message": "Error: User is not the host of an tournament!"}, status=409)
	tournament_games = get_tournament_games_list(tournament)
	if not tournament_games:
		return JsonResponse({"message": "Error: The tournament has no games!"}, status=409)
	return JsonResponse({"message": f"Tournament games sended with success!", "games": tournament_games}, status=200)
