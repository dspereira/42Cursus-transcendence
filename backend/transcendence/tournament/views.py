from django.http import JsonResponse
import json
from user_auth.models import User
from game_engine.models import Match
from custom_utils.models_utils import ModelManager
from .models import Tournament, PlayerList, MatchList

match_model = ModelManager(Match)
user_model = ModelManager(User)
MatchList_model = ModelManager(MatchList)
Tournament_model = ModelManager(Tournament)
PlayerList_model = ModelManager(PlayerList)


def	create_tournament(request):

	if request:
		req_data = json.loads(request.body.decode('utf-8'))
		player1 = user_model.get(id=req_data["user_id"])
		new_PlayerList = PlayerList_model.create(player1=player1, player2=0, player3=0, player4=0, tournament=0, n_players=1)
		new_MatchList = MatchList_model.create(semi_final1=0, semi_final2=0, loser_game=0, final=0, tournament=0, n_matches=0, player_list=new_PlayerList)
		new_tournament = Tournament_model.create(player_list=new_PlayerList, match_list=new_MatchList)
		new_MatchList.tournament = new_tournament
		new_PlayerList.tournament = new_tournament
		new_PlayerList.save()
		new_MatchList.save()
		response = {
			"message": "Tournament successfully created",
			"Tournament_id": new_tournament.id
		}
	else:
		response = {
			"message" : "failed to create tournament"
		}
	return JsonResponse(response)

def	invite_to_tournament(request):

	if request:
		req_data = json.loads(request.body.decode('utf-8'))
		Tournament_id = Tournament_model.get(id=req_data["tournament_id"])
		PlayerList_id = PlayerList_model.get(id=Tournament_id.player_list)
		if PlayerList_id.n_players < 4:
			if (PlayerList_id.player2 is None):
				PlayerList_id.player2 = user_model.get(id=req_data["invited_id"])
			elif (PlayerList_id.player3 is None):
				PlayerList_id.player3 = user_model.get(id=req_data["invited_id"])
			elif (PlayerList_id.player4 is None):
				PlayerList_id.player4 = user_model.get(id=req_data["invited_id"])
			PlayerList_id.n_players += 1
			PlayerList_id.save()
			response = {
				"message": "User invited"
			}
		else:
			response = {
				"message": "Already has 4 users"
			}
	else:
		response = {
			"message" : "failed to invite user"
		}
	return JsonResponse(response)

def	create_semi_finals(MatchList_id, PlayerList_id):

	player1 = user_model.get(PlayerList_id.player1)
	player2 = user_model.get(PlayerList_id.player2)
	player3 = user_model.get(PlayerList_id.player3)
	player4 = user_model.get(PlayerList_id.player4)

	MatchList_id.semi_final1 = match_model.create(user1=player1, user2=player2, user1_score=0, user2_score=0)
	MatchList_id.semi_final2 = match_model.create(user1=player3, user2=player4, user1_score=0, user2_score=0)
	
	MatchList_id.n_matches +=2

	MatchList_id.save()
	

def	matches_finished(MatchList_id):
	semi_final1 = match_model.get(MatchList_id.semi_final1)
	semi_final2 = match_model.get(MatchList_id.semi_final2)
	if semi_final1.winner is not None and semi_final2.winner is not None:
		return True
	else:
		return False

def	create_final_games(MatchList_id, PlayerList_id):
	semi_final1 = match_model.get(MatchList_id.semi_final1)
	semi_final2 = match_model.get(MatchList_id.semi_final2)
	if semi_final1.winner is not None and semi_final2.winner is not None:
		if semi_final1.winner is PlayerList_id.player1:
			loser1 = PlayerList_id.player2
		elif semi_final1.winner is PlayerList_id.player2:
			loser1 = PlayerList_id.player1
		if semi_final1.winner is PlayerList_id.player3:
			loser2 = PlayerList_id.player4
		elif semi_final2.winner is PlayerList_id.player4:
			loser2 = PlayerList_id.player3

		MatchList_id.final = match_model.create(user1=semi_final1.winner, user2=semi_final2.winner, user1_score=0, user2_score=0)
		MatchList_id.loser_game = match_model.create(user1=loser1, user2=loser2, user1_score=0, user2_score=0)
		MatchList_id.save()
		return True
	return False

def update_tournament(request):

	if request:
		req_data = json.loads(request.body.decode("utf-8"))
		Tournament_id = Tournament_model.get(id=req_data["tournament_id"])
		MatchList_id = MatchList_model.get(id=Tournament_id.match_list)
		PlayerList_id = PlayerList_model.get(id=Tournament_id.player_list)
		if PlayerList_id.n_players is 4:
			if MatchList_id.n_matches is None:
				create_semi_finals(MatchList_id, PlayerList_id)
			if MatchList_id.n_matches is 2 and matches_finished(MatchList_id) is True:
				if create_final_games(MatchList_id, PlayerList_id) is True:
					response = {
						"message": "game_updated"
					}
				else:
					response = {
						"message": "game failed to update finals"
					}
					return JsonResponse(response)
			response = {
				"message": "game updated"
			}
	else:
		response = {
			"message": "game failed to update"
		}
	return JsonResponse(response)

