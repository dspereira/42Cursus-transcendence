from custom_utils.requests_utils import get_request_exp_time
from custom_utils.models_utils import ModelManager
from user_profile.aux import get_image_url
from datetime import datetime

from user_profile.models import UserProfileInfo
from .models import TournamentRequests
from .models import TournamentPlayers

from custom_utils.requests_utils import REQ_STATUS_PENDING, REQ_STATUS_ABORTED, REQ_STATUS_DECLINED, REQ_STATUS_ACCEPTED
from custom_utils.requests_utils import update_request_status
from .consts import *

from friendships.friendships import get_single_user_info

tournament_requests_model = ModelManager(TournamentRequests)
tournament_players_model = ModelManager(TournamentPlayers)
user_profile_model = ModelManager(UserProfileInfo)

def get_user_profile(user):
	return user_profile_model.get(user=user)

def get_valid_tournament_requests_list(tournament_requests):
	current_time = datetime.now()
	tournament_requests_list = []
	for req in tournament_requests:
		if req.exp.timestamp() > current_time.timestamp() and req.status == REQ_STATUS_PENDING:
			tournament_requests_list.append(req)
	if len(tournament_requests_list):
		return tournament_requests_list
	return None

def get_tournament_requests_list(user):
	tournament_requests_list = None
	tournament_requests_info = []
	tournament_requests = tournament_requests_model.filter(to_user=user)
	if tournament_requests:
		tournament_requests = tournament_requests.order_by("created")
		tournament_requests_list = get_valid_tournament_requests_list(tournament_requests=tournament_requests)
		if tournament_requests_list:
			for tournament_req in tournament_requests_list:
				req_info = {
					"req_id": tournament_req.id,
					"id": tournament_req.from_user.id,
					"username": tournament_req.from_user.username,
					"image": get_image_url(get_user_profile(user=tournament_req.from_user)),
					"exp": get_request_exp_time(tournament_req)
				}
				tournament_requests_info.append(req_info)
	return tournament_requests_info

def get_tournament_user_requests_list(tournament):
	tournament_user_requests_list = None
	tournament_user_requests_info = []
	tournament_requests = tournament_requests_model.filter(tournament=tournament)
	if tournament_requests:
		tournament_requests = tournament_requests.order_by("created")
		tournament_user_requests_list = get_valid_tournament_requests_list(tournament_requests=tournament_requests)
		if tournament_user_requests_list:
			for tournament_req in tournament_user_requests_list:
				user_req_info = {"id": tournament_req.to_user.id}
				tournament_user_requests_info.append(user_req_info)
	return tournament_user_requests_info

def has_already_valid_tournament_request(user1, user2):
	tournament_requests = tournament_requests_model.filter((Q(from_user=user1) | Q(to_user=user1)))
	if tournament_requests:
		tournament_requests = tournament_requests.filter(Q(from_user=user2) | Q(to_user=user2))
		if tournament_requests:
			tournament_requests_list = get_valid_tournament_requests_list(tournament_requests=tournament_requests)
			if tournament_requests_list:
				return True
	return False

def get_tournament_list(user):
	tournaments_list = []
	tournaments = tournament_players_model.filter(user=user)
	if tournaments:
		for tournament in tournaments:
			tournament_info = {
				'name': tournament.tournament.name
			}
			tournaments_list.append(tournament_info)
		return tournaments_list
	return None

def update_tournament_status(tournament, new_status):
	if tournament:
		tournament.status = new_status
		tournament.save()

def add_player_to_tournament(tournament, player):
	new_tournament_player = tournament_players_model.create(user=player, tournament=tournament)
	return (new_tournament_player if new_tournament_player else None)

def has_active_tournament(user):
	if user:
		tournament_players = tournament_players_model.filter(user=user)
		if tournament_players:
			tournament = tournament_players.last().tournament
			if tournament.status != TOURNAMENT_STATUS_ABORTED and tournament.status != TOURNAMENT_STATUS_FINISHED:
				return tournament
	return None

def get_tournament_players(tournament):
	tournament_players_list = []
	tournament_players = tournament_players_model.filter(tournament=tournament)
	for player in tournament_players:
		user_info = get_single_user_info(get_user_profile(player.user))
		tournament_players_list.append(user_info)
	return tournament_players_list if len(tournament_players_list) else None

def invalidate_active_tournament_invites(tournament):
	current_time = datetime.now()
	tournament_requests = tournament_requests_model.filter(tournament=tournament)
	for request in tournament_requests:
		if request.exp.timestamp() > current_time.timestamp() and request.status == REQ_STATUS_PENDING:
			update_request_status(request, REQ_STATUS_ABORTED)

def get_current_tournament_players(tournament):
	current_tournament_players = []
	current_players = tournament_players_model.filter(tournament=tournament)
	for player in current_players:
		current_tournament_players.append({"id": player.user.id})
	return current_tournament_players

def is_user_inside_list(users_list, user_id):
	for user in users_list:
		if user['id'] == user_id:
			return True
	return False
