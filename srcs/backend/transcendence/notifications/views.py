from django.http import JsonResponse
from custom_decorators import login_required, accepted_methods
from custom_utils.models_utils import ModelManager
from user_auth.models import User
from game.utils import get_game_requests_list
from tournament.utils import get_tournament_requests_list
from friendships.friendships import get_friends_request_list

user_model = ModelManager(User)

@login_required
@accepted_methods(["GET"])
def requests_notifications(request):
	user = user_model.get(id=request.access_data.sub)
	if user:
		n_game_requests = len(get_game_requests_list(user))
		n_tournament_requests = len(get_tournament_requests_list(user))
		n_friend_requests = get_friends_request_list(user, False)
		n_friend_requests = len(n_friend_requests) if n_friend_requests else 0
		return JsonResponse({
			"message": f"Number of requests returned with success.", 
			"number_game_requests": n_game_requests,
			"number_tournament_requests": n_tournament_requests,
			"number_friend_requests": n_friend_requests},
			status=200)
	else:
		return JsonResponse({"message": "Error: Invalid User!"}, status=400)
