from custom_utils.requests_utils import get_request_exp_time
from custom_utils.models_utils import ModelManager
from user_profile.aux import get_image_url
from datetime import datetime
from django.db.models import Q
from asgiref.sync import async_to_sync
from live_chat.models import ChatRoom, Message
import random
import math
import re

from user_profile.models import UserProfileInfo
from .models import TournamentRequests
from .models import TournamentPlayers
from game.models import Games
from user_auth.models import User

from custom_utils.requests_utils import REQ_STATUS_PENDING, REQ_STATUS_ABORTED, REQ_STATUS_DECLINED, REQ_STATUS_ACCEPTED
from custom_utils.requests_utils import update_request_status
from custom_utils.requests_utils import is_valid_request
from .consts import *
from game.utils import GAME_STATUS_CREATED, GAME_STATUS_FINISHED, GAME_STATUS_SURRENDER
from friendships.friendships import get_single_user_info, get_friendship
from custom_utils.blitzpong_bot_utils import send_message
from user_settings.models import UserSettings

tournament_requests_model = ModelManager(TournamentRequests)
tournament_players_model = ModelManager(TournamentPlayers)
user_profile_model = ModelManager(UserProfileInfo)
user_settings_model = ModelManager(UserSettings)
games_model = ModelManager(Games)
user_model = ModelManager(User)
room_model = ModelManager(ChatRoom)
msg_model = ModelManager(Message)

def get_user_profile(user):
	if user:
		return user_profile_model.get(user=user)
	return None

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
				user_req_info = {
					"req_id": tournament_req.id,
					"id": tournament_req.to_user.id,
					"username": tournament_req.to_user.username,
					"image": get_image_url(get_user_profile(user=tournament_req.to_user)),
					"exp": get_request_exp_time(tournament_req)
				}
				tournament_user_requests_info.append(user_req_info)
	return tournament_user_requests_info

def has_already_valid_tournament_request(user1, user2):
	tournament_requests = tournament_requests_model.filter(from_user=user1, to_user=user2)
	if tournament_requests:
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
			current_tournament = tournament.tournament
			if current_tournament.status == TOURNAMENT_STATUS_FINISHED:
				winner = get_tournament_winner(current_tournament)
				tournament_info = {
					"id": current_tournament.id,
					'name': current_tournament.name,
					"is_winner": is_user_tournament_winner(user.id, winner['id'] if winner else 0),
					"creation_date": current_tournament.created
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
	if new_tournament_player:
		update_nbr_players(tournament, tournament.nbr_players + 1)
		return new_tournament_player
	return None

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
	if tournament_requests:
		for request in tournament_requests:
			if request.exp.timestamp() > current_time.timestamp() and request.status == REQ_STATUS_PENDING:
				update_request_status(request, REQ_STATUS_ABORTED)

def is_user_inside_list(users_list, user_id):
	if users_list:
		for user in users_list:
			if user['id'] == user_id:
				return True
	return False

def delete_single_tournament_player(user, tournament):
	tournament_player = tournament_players_model.get(user=user, tournament=tournament)
	if tournament_player:
		tournament_player.delete()
		return True
	return False

def update_nbr_players(tournament, new_nbr):
	tournament.nbr_players = new_nbr
	tournament.save()

def delete_tournament_games(tournament):
	tournament_games = games_model.filter(tournament=tournament)
	if tournament_games:
		for game in tournament_games:
			game.delete()

def get_game_info(game):
	user1_profile = get_user_profile(game.user1) if game.user1 else None
	user2_profile = get_user_profile(game.user2) if game.user2 else None
	winner = get_user_profile(game.winner)
	game_info = {
		"id": game.id,
		"player1": get_single_user_info(user1_profile),
		"player2": get_single_user_info(user2_profile),
		"player1_score": game.user1_score,
		"player2_score": game.user2_score,
		"winner": get_single_user_info(winner),
		"played_time": game.played
	}
	return game_info

def get_tournament_games_list(tournament):
	tournament_games_list = []
	tournament_games = games_model.filter(tournament=tournament)
	if tournament_games:
		tournament_games = tournament_games.order_by("id")
		for game in tournament_games:
			game_info = get_game_info(game)
			tournament_games_list.append(game_info)
	return tournament_games_list

def create_tournament_single_game(user1=None, user2=None, tournament=None):
	new_tournament_game = games_model.create(user1=user1, user2=user2, tournament=tournament)
	if not new_tournament_game:
		delete_tournament_games(tournament)
		return None
	return new_tournament_game

def create_tournament_games(tournament):
	tournament_players = get_tournament_players(tournament)
	random.shuffle(tournament_players)
	nbr_players = len(tournament_players)
	nbr_initial_games = nbr_players / 2
	nbr_final_games = nbr_players - nbr_initial_games - 1
	i = 0
	while i <= nbr_initial_games:
		user1 = user_model.get(id=tournament_players[i]['id'])
		user2 = user_model.get(id=tournament_players[i + 1]['id'])
		if not create_tournament_single_game(user1=user1, user2=user2, tournament=tournament):
			return False
		i += 2
	i = 0
	while i < nbr_final_games:
		if not create_tournament_single_game(tournament=tournament):
			return False
		i += 1
	return True

def get_next_game(tournament, user):
	tournament_games = games_model.filter(tournament=tournament)
	for game in tournament_games:
		if game.status == GAME_STATUS_CREATED and (game.user1 == user or game.user2 == user):
			return game
	return None

def is_tournament_finished(tournament):
	tournament_games = games_model.filter(tournament=tournament)
	if tournament_games:
		tournament_games = tournament_games.order_by('id')
		tournament_games = list(tournament_games)
		last_game = tournament_games[-1]
		if last_game.status == GAME_STATUS_FINISHED:
			return last_game
	return None

def update_next_game(tournament, user, game):
	tournament_games = games_model.filter(tournament=tournament)
	if tournament_games:
		tournament_games = tournament_games.order_by("id")
		tournament_games = list(tournament_games)
		half_nbr_players = tournament.nbr_max_players / 2
		index = tournament_games.index(game)
		if index < len(tournament_games) - 1:
			next_game_index = int(math.floor(index / 2) + half_nbr_players)
			next_game = tournament_games[next_game_index]
			if next_game:
				if not index or index % 2 == 0:
					next_game.user1 = user
				else:
					next_game.user2 = user
				next_game.save()

def is_final_game(game_id, tournament):
	tournament_games = games_model.filter(tournament=tournament)
	if tournament_games:
		tournament_games = tournament_games.order_by("id")
		tournament_games = list(tournament_games)
		last_game = tournament_games[-1]
		if last_game and last_game.id == game_id:
			return True
	return False

def is_tournament_full(tournament):
	if tournament.nbr_players == tournament.nbr_max_players:
		return True
	return False

def cancel_active_tournament_invites(tournament):
	tournament_requests = tournament_requests_model.filter(tournament=tournament)
	for req in tournament_requests:
		if is_valid_request(req):
			update_request_status(req, REQ_STATUS_ABORTED)

def get_tournament_winner(tournament):
	tournament_games = games_model.filter(tournament=tournament)
	winner = None
	if tournament_games:
		tournament_games = tournament_games.order_by("id")
		tournament_games = list(tournament_games)
		last_game = tournament_games[-1]
		if last_game.status == GAME_STATUS_FINISHED or last_game.status == GAME_STATUS_SURRENDER:
			winner = get_single_user_info(get_user_profile(last_game.winner))
	return winner

def get_all_tournament_info(tournament):
	all_tournament_info = None
	if tournament:
		all_tournament_info = {
			"id": tournament.id,
			"name": tournament.name,
			"players": get_tournament_players(tournament),
			"games": get_tournament_games_list(tournament)
		}
	return all_tournament_info

def is_user_tournament_winner(user_id, winner_id):
	if user_id == winner_id:
		return True
	return False

def is_valid_tournament_name(tournament_name):
	valid_tournament_name_pattern = r'^[A-Za-z0-9_\-\s]+$'
	if tournament_name and len(tournament_name) <= 50:
		if bool(re.match(valid_tournament_name_pattern, tournament_name)):
			return True
	return False

def get_tournament_info(tournament):
	if not tournament:
		return None
	tournament_info = {
		"id": tournament.id,
		"name": tournament.name,
		"status": tournament.status,
		"owner": tournament.owner.id
	}
	return tournament_info

def update_users_tournament_stats(tournament):
	last_game = is_tournament_finished(tournament)
	if last_game:
		winner_id = last_game.winner.id
		players = tournament_players_model.filter(tournament=tournament)
		for player in players:
			player_id = player.user.id
			player_profile = user_profile_model.get(user=player.user)
			player_profile.tournaments_played = player_profile.tournaments_played + 1
			if player_id == winner_id:
				player_profile.tournaments_won = player_profile.tournaments_won + 1
			else:
				player_profile.tournaments_lost = player_profile.tournaments_lost + 1
			player_profile.tournaments_win_rate = player_profile.tournaments_won / player_profile.tournaments_played * 100
			player_profile.save()

def send_games_notifications(tournament):
	bot_user = user_model.get(username="BlitzPong")
	tournament_games = games_model.filter(tournament=tournament, notifications_sent=False, user1__isnull=False, user2__isnull=False, status=GAME_STATUS_CREATED)
	if tournament_games:
		for game in tournament_games:
			send_game_notif(bot_user, game)
			game.notifications_sent = True
			game.save()

def send_game_notif(bot_user, game):
	user1 = game.user1
	user2 = game.user2
	friendship_user1 = get_friendship(bot_user, user1)
	friendship_user2 = get_friendship(bot_user, user2)
	if not friendship_user1 or not friendship_user2:
		return None
	group_name1 = str(bot_user.id) + "_" + str(user1.id)
	group_name2 = str(bot_user.id) + "_" + str(user2.id)
	room1 = room_model.get(name=group_name1)
	room2 = room_model.get(name=group_name2)
	if not room1 or not room2:
		return None
	message1 = generate_next_game_message(user1, user2.username)
	message2 = generate_next_game_message(user2, user1.username)
	message_obj_1 = msg_model.create(user=bot_user, room=room1, content=message1)
	message_obj_2 = msg_model.create(user=bot_user, room=room2, content=message2)
	if not message_obj_1 or not message_obj_2:
		return None
	async_to_sync(send_message)(bot_user, friendship_user1, group_name1, message_obj_1)
	async_to_sync(send_message)(bot_user, friendship_user2, group_name2, message_obj_2)

def generate_next_game_message(user, against_username):
	default_message = "You have a new tournament game."
	if not user:
		return default_message
	user_settings = user_settings_model.get(user=user)
	message = None
	if user_settings:
		user_language = user_settings.language
		if user_language:
			if user_language == "pt":
				message = f"Tens um novo jogo de torneio contra {against_username}."
			elif user_language == "es":
				message = f"¡Tienes un nuevo juego de torneo contra {against_username}!"
			else:
				message = f"You have a new tournament game against {against_username}."
	if not message:
		return default_message
	return message
