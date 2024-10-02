from custom_utils.requests_utils import get_request_exp_time
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from datetime import timedelta, datetime
from .models import GameRequests, Games
from user_auth.models import User
from django.db.models import Q
import math

from custom_utils.requests_utils import REQ_STATUS_PENDING, REQ_STATUS_DECLINED
from custom_utils.requests_utils import REQ_EXP_TIME_SECONDS

from user_profile.aux import get_image_url

game_requests_model = ModelManager(GameRequests)
games_model = ModelManager(Games)
user_model = ModelManager(User)
user_profile_model = ModelManager(UserProfileInfo)

GAME_STATUS_FINISHED = "finished"
GAME_STATUS_ABORTED = "aborted"
GAME_STATUS_PLAYING = "playing"
GAME_STATUS_CREATED = "created"
GAME_STATUS_SURRENDER = "surrender"

def get_user_profile(user):
	return user_profile_model.get(user=user)

def get_valid_game_requests_list(game_requests):
	current_time = datetime.now()
	game_request_list = []
	for req in game_requests:
		if req.exp.timestamp() > current_time.timestamp() and req.status == REQ_STATUS_PENDING:
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
					"image": get_image_url(get_user_profile(user=game_req.from_user)),
					"exp": get_request_exp_time(game_req)
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
		"user2_image": get_image_url(get_user_profile(user=game.user2)),
		"winner": is_user_winner(winner=game.winner, user=user),
		"sorrender": True if game.status == "aborted" else False,
		"date": game.played
	}
	return game_info

def get_games_list(user):
	games_list = []
	games = get_user_games(user=user)
	if games:
		for game in games:
			if (game.status == GAME_STATUS_FINISHED or game.status == GAME_STATUS_SURRENDER) and not game.tournament:
				game_info = get_game_info(game=game, user=user)
				games_list.append(game_info)
	return games_list

def has_already_games_accepted(user):
	user_games = get_user_games(user=user)
	if user_games:
		created_game = user_games.filter(status="created", tournament=None)
		if created_game:
			return True
	return False

def cancel_other_invitations(user):
	current_time = datetime.now()
	game_requests = game_requests_model.filter(from_user=user)
	if game_requests:
		for req in game_requests:
			if req.exp.timestamp() > current_time.timestamp() and req.status == REQ_STATUS_PENDING:
				req.status = REQ_STATUS_DECLINED
				req.save()

def has_user_pending_game_requests(user):
	game_requests = game_requests_model.filter(from_user=user, status=REQ_STATUS_PENDING)
	if game_requests:
		if get_valid_game_requests_list(game_requests):
			return True
	return False

def get_request_exp_time(game_request):
	current_time = datetime.now().timestamp()
	req_exp_time = game_request.exp.timestamp()
	diff_time_minutes = (req_exp_time - current_time) / 60
	if diff_time_minutes <= 0.3:
		return f"30 sec left"
	return f"{math.floor(diff_time_minutes) + 1} min left"

def update_users(user1_id, user2_id, winner):
	user1 = user_profile_model.get(user=user1_id)
	user2 = user_profile_model.get(user=user2_id)

	user1.total_games = user1.total_games + 1
	user2.total_games = user2.total_games + 1

	if winner == user1_id:
		user1_id.victories = user1_id.victories + 1
		user2_id.defeats = user2_id.defeats + 1
	else:
		user2_id.victories = user2_id.victories + 1
		user1_id.defeats = user1_id.defeats + 1

	user1.win_rate = user1.victories / user1.total_games
	user2.win_rate = user2.victories / user2.total_games

	user1.save()
	user2.save()