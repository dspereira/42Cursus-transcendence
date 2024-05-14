from django.http import JsonResponse
import json
from user_auth.models import User
from game_engine.models import Match
from custom_utils.models_utils import ModelManager
from .models import Tournament, PlayerList, MatchList
from custom_decorators import login_required, accepted_methods

match_model = ModelManager(Match)
user_model = ModelManager(User)
MatchList_model = ModelManager(MatchList)
Tournament_model = ModelManager(Tournament)
PlayerList_model = ModelManager(PlayerList)


def checker(req_data, request):

	User = user_model.get(request.access_data.sub)
	if User is None:
		return -1
	Tournament_id = Tournament_model.get(id=req_data["tournament_id"])
	if Tournament_id is None:
		return -2
	MatchList_id = MatchList_model.get(id=Tournament_id.match_list.id)
	PlayerList_id = PlayerList_model.get(id=Tournament_id.player_list.id)
	if PlayerList_id is None or MatchList_id is None:
		return -2
	if User.id == PlayerList_id.player1.id:
		return 1
	if User.id == PlayerList_id.player2.id or User.id == PlayerList_id.player3.id or User.id == PlayerList_id.player4.id:
		return 2
	return -5









# @login_required
def	create_tournament(request):

	if request.body:
		# player1 = user_model.get(id=req_data["user_id"])
		player1 = request.access_data.sub
		if player1:
			# new_tournament = Tournament_model.create(player_list=0, match_list=0)
			new_PlayerList = PlayerList_model.create(n_players=1,player1=player1)
			new_MatchList = MatchList_model.create()
			new_tournament = Tournament_model.create(player_list=new_PlayerList, match_list=new_MatchList)
			response = {
				"message": "Tournament successfully created",
				"Tournament_id": new_tournament.id
			}
			return JsonResponse(response)

	response = {
		"message" : "failed to create tournament"
	}
	return JsonResponse(response)

	








def	insert_user(request, PlayerList_id):

	#Checks if the player is already invited
	invitee = user_model.get(request.access_data.sub)
	if (PlayerList_id.player1 == invitee or PlayerList_id.player2 == invitee or PlayerList_id.player3 == invitee or PlayerList_id.player4 == invitee):
		return False
	#Inserts the player
	if (PlayerList_id.player2 is None):
		PlayerList_id.player2 = invitee
	elif (PlayerList_id.player3 is None):
		PlayerList_id.player3 = invitee
	elif (PlayerList_id.player4 is None):
		PlayerList_id.player4 = invitee
	else:
		return False
	PlayerList_id.n_players += 1
	PlayerList_id.save()
	return True

@login_required
def	invite_to_tournament(request):

	if request.body:
		req_data = json.loads(request.body.decode('utf-8'))
		Tournament_id = Tournament_model.get(id=req_data["tournament_id"])
		if checker(req_data, request) == 1:
			PlayerList_id = PlayerList_model.get(id=Tournament_id.player_list.id)
			if insert_user(request, PlayerList_id) is True:
				response = {
					"message": "User invited"
				}
				return JsonResponse(response)

	response = {
		"message" : "failed to invite user"
	}

	return JsonResponse(response)










def	create_semi_finals(MatchList_id, PlayerList_id):

	player1 = user_model.get(id=PlayerList_id.player1.id)
	player2 = user_model.get(id=PlayerList_id.player2.id)
	player3 = user_model.get(id=PlayerList_id.player3.id)
	player4 = user_model.get(id=PlayerList_id.player4.id)

	MatchList_id.semi_final1 = match_model.create(user1=player1, user2=player2, user1_score=0, user2_score=0)
	MatchList_id.semi_final2 = match_model.create(user1=player3, user2=player4, user1_score=0, user2_score=0)
	
	MatchList_id.n_matches +=2
	MatchList_id.save()


def	matches_finished(MatchList_id):

	semi_final1 = match_model.get(id=MatchList_id.semi_final1.id)
	semi_final2 = match_model.get(id=MatchList_id.semi_final2.id)
	if semi_final1.winner and semi_final2.winner:
		return True
	else:
		return False


def	create_final_games(MatchList_id, PlayerList_id):
	
	semi_final1 = match_model.get(id=MatchList_id.semi_final1.id)
	semi_final2 = match_model.get(id=MatchList_id.semi_final2.id)
	
	if semi_final1.winner.id is PlayerList_id.player1.id:
		loser1 = PlayerList_id.player2
	elif semi_final1.winner.id is PlayerList_id.player2.id:
		loser1 = PlayerList_id.player1
	if semi_final2.winner.id is PlayerList_id.player3.id:
		loser2 = PlayerList_id.player4
	elif semi_final2.winner.id is PlayerList_id.player4.id:
		loser2 = PlayerList_id.player3
		
	MatchList_id.final = match_model.create(user1=semi_final1.winner, user2=semi_final2.winner, user1_score=0, user2_score=0)
	MatchList_id.loser_game = match_model.create(user1=loser1, user2=loser2, user1_score=0, user2_score=0)
	MatchList_id.n_matches += 2

	MatchList_id.save()

@login_required
def update_tournament(request):

	if request.body:
		req_data = json.loads(request.body.decode("utf-8"))
		if checker(req_data, request) > 0:
			Tournament_id = Tournament_model.get(id=req_data["tournament_id"])
			MatchList_id = MatchList_model.get(id=Tournament_id.match_list.id)
			PlayerList_id = PlayerList_model.get(id=Tournament_id.player_list.id)
			if PlayerList_id.n_players == 4:
				if MatchList_id.n_matches == 0:
					create_semi_finals(MatchList_id, PlayerList_id)
					response = {
						"message": "semi-finals were created",
						"game1": MatchList_id.semi_final1.id,
						"game2": MatchList_id.semi_final2.id
					}
				elif MatchList_id.n_matches == 2 and matches_finished(MatchList_id) == True:
					create_final_games(MatchList_id, PlayerList_id)
					response = {
						"message": "finals were created",
						"game1": MatchList_id.final.id,
						"game2": MatchList_id.loser_game.id
					}
				else:
					response = {
						"message": "game failed to update"
					}
				return JsonResponse(response)
			response = {
				"message": "There aren't 4 players yet"
			}
			return JsonResponse(response)
	response = {
		"message": "game failed to update"
	}
	return JsonResponse(response)





@login_required
def get_results(request):
	if request.body:
		req_data = json.loads(request.body.decode("utf-8"))
		if checker(req_data, request) > 0:
			Tournament_id = Tournament_model.get(id=req_data["tournament_id"])
			MatchList_id = MatchList_model.get(id=Tournament_id.match_list.id)
			first_place = MatchList_id.final.winner
			second_place = MatchList_id.final.user1 if MatchList_id.final == MatchList_id.final.user1 else MatchList_id.final.user2
			third_place = MatchList_id.loser_game.winner
			forth_place = MatchList_id.loser_game.user1 if MatchList_id.loser_game == MatchList_id.loser_game.user1 else MatchList_id.loser_game.user2
			response = {
				"message": "Successfuly fetched results",
				"first_place": first_place,
				"second_place": second_place,
				"third_place": third_place,
				"forth_place": forth_place
			}
			return JsonResponse(response)
	response = {
		"message": "Failed fetching results",
	}
	return JsonResponse(response)


