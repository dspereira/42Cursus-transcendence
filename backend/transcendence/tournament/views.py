from django.http import JsonResponse
import json
from user_auth.models import User
from game_engine.models import Match
from custom_utils.models_utils import ModelManager
from .models import Tournament, PlayerList, MatchList
from custom_decorators import login_required, accepted_methods


match_model = ModelManager(Match)
user_model = ModelManager(User)
match_list_model = ModelManager(MatchList)
tournament_model = ModelManager(Tournament)
player_list_model = ModelManager(PlayerList)

#check player position on function, rewrap this into a decorator
def checker(req_data, request):

	user = user_model.get(id=request.access_data.sub)

	tournament = tournament_model.get(id=req_data["tournament_id"])
	if tournament is None:
		return -1
	match_list = match_list_model.get(id=tournament.match_list.id)
	player_list = player_list_model.get(id=tournament.player_list.id)
	if player_list is None or match_list is None:
		return -1
	if user.id == player_list.player1.id or user.id == player_list.player2.id or user.id == player_list.player3.id or user.id == player_list.player4.id:
		return 1
	return -1









@accepted_methods(["POST"])
@login_required
def	create_tournament(request):

	player1 = user_model.get(id=request.access_data.sub)
	new_player_list = player_list_model.create(n_players=1,player1=player1)
	new_match_list = match_list_model.create()
	new_tournament = tournament_model.create(player_list=new_player_list, match_list=new_match_list)
	if not new_tournament:
		response = {
			"message": "Creation failed",
		}
	else:
		response = {
			"message": "Tournament successfully created",
			"tournament_id": new_tournament.id
		}
	return JsonResponse(response)










def	insert_user(req_data, player_list):

	#Checks if the player is already invited
	invitee = user_model.get(id=req_data["invitee"])
	print(invitee)
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


@accepted_methods(["POST"])
@login_required
def	invite_to_tournament(request):

	if request.body:
		req_data = json.loads(request.body.decode('utf-8'))
		tournament = tournament_model.get(id=req_data.get("tournament_id"))
		player_list = player_list_model.get(id=tournament.player_list.id)
		print("cheguei aqui")
		if user_model.get(id=request.access_data.sub).id == player_list.player1.id:
			player_list = player_list_model.get(id=tournament.player_list.id)
			if insert_user(req_data, player_list) is True:
				response = {
					"message": "User invited"
				}
				return JsonResponse(response)
		else:
			print("entrei aqui")
			response = {
				"message" : "Only the creator of the tournament can invite users"
			}
	response = {
		"message" : "failed to invite user"
	}

	return JsonResponse(response)










def	create_semi_finals(match_list, player_list):

	player1 = user_model.get(id=player_list.player1.id)
	player2 = user_model.get(id=player_list.player2.id)
	player3 = user_model.get(id=player_list.player3.id)
	player4 = user_model.get(id=player_list.player4.id)

	match_list.semi_final1 = match_model.create(user1=player1, user2=player2, user1_score=0, user2_score=0)
	match_list.semi_final2 = match_model.create(user1=player3, user2=player4, user1_score=0, user2_score=0)
	
	match_list.n_matches +=2
	match_list.save()


def	matches_finished(match_list):

	semi_final1 = match_model.get(id=match_list.semi_final1.id)
	semi_final2 = match_model.get(id=match_list.semi_final2.id)
	if semi_final1.winner and semi_final2.winner:
		return True
	else:
		return False


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


@accepted_methods(["POST"])
@login_required
def update_tournament(request):

	if request.body:
		req_data = json.loads(request.body.decode("utf-8"))
		if checker(req_data, request) == 1:
			tournament = tournament_model.get(id=req_data["tournament_id"])
			match_list = match_list_model.get(id=tournament.match_list.id)
			player_list = player_list_model.get(id=tournament.player_list.id)

			if player_list.n_players == 4:
				if match_list.n_matches == 0:
					create_semi_finals(match_list, player_list)
					response = {
						"message": "semi-finals were created",
						"game1": match_list.semi_final1.id,
						"game2": match_list.semi_final2.id
					}
				elif match_list.n_matches == 2 and matches_finished(match_list) == True:
					create_final_games(match_list, player_list)
					response = {
						"message": "finals were created",
						"game1": match_list.final.id,
						"game2": match_list.loser_game.id
					}
				else:
					response = {
						"message": "game failed to update"
					}
				return JsonResponse(response)
			return JsonResponse({"message": "There aren't 4 players yet"})
	return JsonResponse({"message": "game failed to update"})






def _get_row(tournament):
	match_list = match_list_model.get(id=tournament.match_list.id)
	player_list = player_list_model.get(id=tournament.player_list.id)
	if match_list.n_matches == 4 and match_list.final.winner and match_list.loser_game.winner and player_list.n_players == 4:

		first_place = match_list.final.winner
		second_place = match_list.final.user1 if match_list.final.winner == match_list.final.user1 else match_list.final.user2
		third_place = match_list.loser_game.winner
		forth_place = match_list.loser_game.user1 if match_list.loser_game.winner == match_list.loser_game.user2 else match_list.loser_game.user1

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
			"first_place": "-",
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


@login_required
@accepted_methods(["GET"])
def get_data_tournament(request):
	if request.body:
		req_data = json.loads(request.body.decode("utf-8"))
		if checker(req_data, request) != 0:
			tournament = tournament_model.get(id=req_data["tournament_id"])
			return JsonResponse(_get_row(tournament))
	response = {
		"message": "Failed fetching results",
	}
	return JsonResponse(response)

@accepted_methods(["GET"])
def list_tournaments(request):
	tournament_rooms = tournament_model.all()
	tournament_rooms_count = tournament_model.count()
	tournament_list = []

	if tournament_rooms_count > 0:
		for room in tournament_rooms:
			tournament_list.append(_get_row(room))
		message = "All Tournaments have been listed to successfully !"
	else:
		message = "There are no Tournaments in the DataBase !"
	response = {"message": message, "Tournaments": tournament_list}
	return JsonResponse(response)
