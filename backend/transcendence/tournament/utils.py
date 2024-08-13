from custom_utils.requests_utils import get_request_exp_time
from custom_utils.models_utils import ModelManager
from user_profile.aux import get_image_url
from datetime import datetime

from user_profile.models import UserProfileInfo
from .models import TournamentRequests
from .models import TournamentPlayers

from custom_utils.requests_utils import REQ_STATUS_PENDING, REQ_STATUS_DECLINED, REQ_STATUS_ACCEPTED 

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

def has_already_valid_tournament_request(user1, user2):
	tournament_requests = tournament_requests_model.filter((Q(from_user=user1) | Q(to_user=user1)))
	if tournament_requests:
		tournament_requests = tournament_requests.filter(Q(from_user=user2) | Q(to_user=user2))
		if tournament_requests:
			tournament_requests_list = get_valid_tournament_requests_list(tournament_requests=tournament_requests)
			if tournament_requests_list:
				return True
	return False

def get_tournament_requests_list(user):
	tournaments_list = []
	tournaments = tournament_players_model.filter(user=user)
	for tournament in tournaments:
		tournaments_list.append(tournament.tournament)
	if len(tournaments_list):
		return tournaments_list
	return None

def update_tournament_status(tournament, new_status):
	if tournament:
		tournament.status = new_status
		tournament.save()
