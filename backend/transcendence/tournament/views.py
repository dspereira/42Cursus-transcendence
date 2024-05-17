from django.http import JsonResponse
import json
from user_auth.models import User
from game_engine.models import Match
from custom_utils.models_utils import ModelManager
from .models import Tournament, PlayerList, MatchList
from custom_decorators import login_required, accepted_methods
from .utils.utils import create_final_games, get_row, insert_user, matches_finished, create_semi_finals 
from .utils.custom_decorators import check_tournament

match_model = ModelManager(Match)
user_model = ModelManager(User)
match_list_model = ModelManager(MatchList)
tournament_model = ModelManager(Tournament)
player_list_model = ModelManager(PlayerList)


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


@accepted_methods(["POST"])
@login_required
@check_tournament
def	invite_to_tournament(request):

	req_data = json.loads(request.body.decode('utf-8'))
	tournament = tournament_model.get(id=req_data.get("tournament_id"))
	player_list = player_list_model.get(id=tournament.player_list.id)
	if user_model.get(id=request.access_data.sub).id == player_list.player1.id:
		player_list = player_list_model.get(id=tournament.player_list.id)
		if insert_user(req_data, player_list) is True:
			return JsonResponse({"message": "User has been invited"})
	else:
		return JsonResponse({"message": "Only the creator of the tournament can send invites"})
	return JsonResponse({"message": "Failed to invite user"})


@accepted_methods(["POST"])
@login_required
@check_tournament
def update_tournament(request):

	if request.body:
		req_data = json.loads(request.body.decode("utf-8"))
		tournament = tournament_model.get(id=req_data["tournament_id"])
		match_list = match_list_model.get(id=tournament.match_list.id)
		player_list = player_list_model.get(id=tournament.player_list.id)
		if player_list.n_players == 4:
			if match_list.n_matches == 0:
				return create_semi_finals(match_list, player_list)
			elif match_list.n_matches == 2 and matches_finished(match_list) == 2:
				return create_final_games(match_list, player_list)
		else:
			return JsonResponse({"message": "There aren't 4 players yet"})
	return JsonResponse({"message": "game failed to update"})


@accepted_methods(["GET"])
def list_tournaments(request):
	tournament_rooms = tournament_model.all()
	tournament_rooms_count = tournament_model.count()
	tournament_list = []

	if tournament_rooms_count > 0:
		for room in tournament_rooms:
			print(room.id)
			tournament_list.append(get_row(room))
		message = "All Tournaments have been listed to successfully !"
	else:
		message = "There are no Tournaments in the DataBase !"
	response = {"message": message, "Tournaments": tournament_list}
	return JsonResponse(response)
