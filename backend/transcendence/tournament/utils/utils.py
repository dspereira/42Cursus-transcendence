from django.http import JsonResponse
import json
from user_auth.models import User
from game_engine.models import Match
from custom_utils.models_utils import ModelManager
from tournament.models import Tournament, PlayerList, MatchList

match_model = ModelManager(Match)
user_model = ModelManager(User)
match_list_model = ModelManager(MatchList)
tournament_model = ModelManager(Tournament)
player_list_model = ModelManager(PlayerList)

def check_tournament(func):
	def wrapper(request, *args, **kwargs):
		if request.access_data:
			user = user_model.get(id=request.access_data.sub)
			req_data = json.loads(request.body.decode("utf-8"))
			tournament = tournament_model.get(id=req_data["tournament_id"])
			if tournament:
				player_list = player_list_model.get(id=tournament.player_list.id)
				match_list = match_list_model.get(id=tournament.match_list.id)
				if player_list and match_list:
					if user.id == player_list.player1.id or user.id == player_list.player2.id or user.id == player_list.player3.id or user.id == player_list.player4.id:
						return func(request, *args, **kwargs)
		return JsonResponse({"message": "Unauthorized. Invalid Tournament"}, status=401)
	return wrapper

def	insert_user(req_data, player_list):

	#Checks if the player is already invited
	invitee = user_model.get(id=req_data["invitee"])

	if not invitee or (player_list.player1 == invitee or player_list.player2 == invitee or player_list.player3 == invitee or player_list.player4 == invitee):
		return False
	#Inserts the player
	if not player_list.player2:
		player_list.player2 = invitee
	elif not player_list.player3:
		player_list.player3 = invitee
	elif not player_list.player4:
		player_list.player4 = invitee
	else:
		return False
	player_list.n_players += 1
	player_list.save()
	return True

def	matches_finished(match_list):

	semi_final1 = match_model.get(id=match_list.semi_final1.id)
	semi_final2 = match_model.get(id=match_list.semi_final2.id)
	matches = 0
	if semi_final1.winner and semi_final2.winner:
		final = match_model.get(id=match_list.final.id)
		loser_game = match_model.get(id=match_list.loser_game.id) 
		matches +=2
		if loser_game.winner and final.winner:
			matches += 2
	return matches

def	create_semi_finals(match_list, player_list):

	player1 = user_model.get(id=player_list.player1.id)
	player2 = user_model.get(id=player_list.player2.id)
	player3 = user_model.get(id=player_list.player3.id)
	player4 = user_model.get(id=player_list.player4.id)

	match_list.semi_final1 = match_model.create(user1=player1, user2=player2, user1_score=0, user2_score=0)
	match_list.semi_final2 = match_model.create(user1=player3, user2=player4, user1_score=0, user2_score=0)
	
	match_list.n_matches +=2
	match_list.save()

	response = {
		"message": "semi-finals were created",
		"game1": match_list.semi_final1.id,
		"game2": match_list.semi_final2.id
	}
	return JsonResponse(response)


def	create_final_games(match_list, player_list):
	
	semi_final1 = match_model.get(id=match_list.semi_final1.id)
	semi_final2 = match_model.get(id=match_list.semi_final2.id)
	
	if semi_final1.winner.id is player_list.player1.id:
		loser1 = player_list.player2
	elif semi_final1.winner.id is player_list.player2.id:
		loser1 = player_list.player1
	if semi_final2.winner.id is player_list.player3.id:
		loser2 = player_list.player4
	elif semi_final2.winner.id is player_list.player4.id:
		loser2 = player_list.player3
		
	match_list.final = match_model.create(user1=semi_final1.winner, user2=semi_final2.winner, user1_score=0, user2_score=0)
	match_list.loser_game = match_model.create(user1=loser1, user2=loser2, user1_score=0, user2_score=0)
	match_list.n_matches += 2

	match_list.save()

	response = {
	"message": "finals were created",
	"game1": match_list.final.id,
	"game2": match_list.loser_game.id
	}
	
	return JsonResponse(response)


def get_row(tournament):
	match_list = match_list_model.get(id=tournament.match_list.id)
	player_list = player_list_model.get(id=tournament.player_list.id)
	if match_list.n_matches == 4 and match_list.final.winner and match_list.loser_game.winner and player_list.n_players == 4:

		first_place = match_list.final.winner
		if match_list.final.winner == match_list.final.user1:
			second_place = match_list.final.user2
		else:
			second_place = match_list.final.user1
		third_place = match_list.loser_game.winner
		if match_list.loser_game.winner == match_list.loser_game.user2:
			forth_place = match_list.loser_game.user1
		else:
			forth_place = match_list.loser_game.user2

		matches = [match_model.get(id=match_list.semi_final1.id), match_model.get(id=match_list.semi_final2.id), match_model.get(id=match_list.final.id), match_model.get(id=match_list.loser_game.id)]
		players = [user_model.get(id=player_list.player1.id), user_model.get(id=player_list.player2.id), user_model.get(id=player_list.player3.id), user_model.get(id=player_list.player4.id)]

		print("winner:", first_place, "ID", tournament.id)
		response = {
			"message": "Successfuly fetched results",
			"first_place": first_place.username,
			"second_place": second_place.username,
			"third_place": third_place.username,
			"forth_place": forth_place.username,
			"semi_final1": matches[0].id,
			"semi_final2": matches[1].id,
			"loser_bracket": matches[2].id,
			"final": matches[3].id,
			"player1": players[0].username,
			"player2": players[1].username,
			"player3": players[2].username,
			"player4": players[3].username,
			"id": tournament.id
		}
	else:
		response = {
			"message": "Tournament not finished (under construction)",
			"first_place": "None",
			"second_place": "-",
			"third_place": "-",
			"forth_place":"-",
			"semi_final1": "-",
			"semi_final2": "-",
			"loser_bracket": "-",
			"final": "-",
			"player1": "-",
			"player2": "-",
			"player3": "-",
			"player4": "-",
			"id": tournament.id,
		}
	return response