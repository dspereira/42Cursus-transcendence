from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from datetime import timedelta, datetime
from .models import GameRequests, Games
from user_auth.models import User
from django.db.models import Q

from user_profile.aux import get_image_url

game_requests_model = ModelManager(GameRequests)
games_model = ModelManager(Games)
user_model = ModelManager(User)
user_profile_model = ModelManager(UserProfileInfo)

TIME_HOURS = 0
TIME_MINUTES = 5
TIME_SECONDS = 0

GAME_REQ_EXP_TIME_SECONDS = TIME_HOURS * 3600 + TIME_MINUTES * 60 + TIME_SECONDS

GAME_REQ_STATUS_ACCEPTED = "accepted"
GAME_REQ_STATUS_DECLINED = "declined"
GAME_REQ_STATUS_PENDING = "pending"
GAME_STATUS_FINISHED = "finished"
GAME_STATUS_ABORTED = "aborted"
GAME_STATUS_PLAYING = "playing"
GAME_STATUS_CREATED = "created"

def get_user_profile(user):
	return user_profile_model.get(user=user)

def get_valid_game_requests_list(game_requests):
	current_time = datetime.now()
	game_request_list = []
	for req in game_requests:
		if req.exp.timestamp() > current_time.timestamp() and req.status == GAME_REQ_STATUS_PENDING:
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
	game_requests_info = []
	game_requests = game_requests_model.filter(to_user=user)
	if game_requests:
		game_requests = game_requests.order_by("created")
		game_requests_list = get_valid_game_requests_list(game_requests=game_requests)
		if game_requests_list:
			for game_req in game_requests_list:
				req_info = {
					"req_id": game_req.id,
					"id": game_req.from_user.id,
					"username": game_req.from_user.username,
					"image": get_image_url(get_user_profile(user=game_req.from_user))
				}
				game_requests_info.append(req_info)
	return game_requests_info

def get_user_games(user):
	return games_model.filter((Q(user1=user) | Q(user2=user)))

def is_user_winner(winner, user):
	if winner and user:
		if winner.id == user.id:
			return True
	return False

def get_game_info(game, user):
	game_info = {
		"id": game.id,
		"user1": game.user1.username,
		"user2": game.user2.username,
		"user1_score": game.user1_score,
		"user2_score": game.user2_score,
		"user1_image": get_image_url(get_user_profile(user=game.user1)),
		"user2_image": get_image_url(get_user_profile(user=game.user1)),
		"winner": is_user_winner(winner=game.winner, user=user),
		"sorrender": True if game.status == "aborted" else False
	}
	return game_info

def get_games_list(user):
	games_list = []
	games = get_user_games(user=user)
	if games:
		for game in games:
			if game.status == GAME_STATUS_FINISHED or game.status == GAME_STATUS_ABORTED:
				game_info = get_game_info(game=game, user=user)
				games_list.append(game_info)
	return games_list

def has_already_games_accepted(user):
	user_games = get_user_games(user=user)
	if user_games:
		created_game = user_games.filter(status="created")
		if created_game:
			return True
	return False

def cancel_other_invitations(user):
	current_time = datetime.now()
	game_reuests = game_requests_model.filter(from_user=user)
	for req in game_reuests:
		if req.exp.timestamp() > current_time.timestamp() and req.status == GAME_REQ_STATUS_PENDING:
			req.status = GAME_REQ_STATUS_DECLINED
			req.save()

def has_user_pending_game_requests(user):
	game_reuests = game_requests_model.filter(from_user=user, status=GAME_REQ_STATUS_PENDING)
	if game_reuests:
		if get_valid_game_requests_list(game_reuests):
			return True
	return False
