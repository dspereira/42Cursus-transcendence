from custom_utils.models_utils import ModelManager
from datetime import timedelta, datetime
from .models import GameRequests, Games
from user_auth.models import User
from django.db.models import Q

game_requests_model = ModelManager(GameRequests)
match_model = ModelManager(Games)
user_model = ModelManager(User)

TIME_HOURS = 0
TIME_MINUTES = 5
TIME_SECONDS = 0

GAME_REQ_EXP_TIME_SECONDS = TIME_HOURS * 3600 + TIME_MINUTES * 60 + TIME_SECONDS

def get_valid_game_requests_list(game_requests):
	current_time = datetime.now()
	game_request_list = []
	for req in game_requests:
		if req.exp.timestamp() > current_time.timestamp() and req.status == "pending":
			game_request_list.append(req)
	if len(game_request_list):
		return game_request_list
	return None

def has_already_valid_game_request(user1, user2):
	game_request = game_requests_model.filter((Q(from_user=user1) | Q(to_user=user1)))
	if game_request:
		game_request = game_request.filter(Q(from_user=user2) | Q(to_user=user2))
		if game_request:
			game_request_list = get_valid_game_requests_list(game_requests=game_request)
			if game_request_list:
				return True
	return False

def set_exp_time(game_request):
	if game_request:
		game_request.exp = game_request.created + timedelta(seconds=GAME_REQ_EXP_TIME_SECONDS)
		game_request.save()

def update_game_request_status(game_request, new_status):
	if game_request:
		game_request.status = new_status
		game_request.save()

def get_game_requests_list(user):
	game_requests_list = None
	game_requests = game_requests_model.filter(to_user=user)
	if game_requests:
		game_requests = game_requests.order_by("created")
		game_requests_list = get_valid_game_requests_list(game_requests=game_requests)
	return game_requests_list
