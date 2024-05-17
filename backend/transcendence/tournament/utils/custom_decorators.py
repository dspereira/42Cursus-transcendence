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