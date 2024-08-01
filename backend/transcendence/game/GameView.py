from django.utils.decorators import method_decorator
from custom_utils.models_utils import ModelManager
from custom_decorators import login_required
from django.http import JsonResponse
from user_auth.models import User
from .models import GameRequests, Games
from django.views import View
import json

from .utils import get_games_list

game_requests_model = ModelManager(GameRequests)
user_model = ModelManager(User)

class GameView(View):

	@method_decorator(login_required)
	def get(self, request):
		user = user_model.get(id=request.access_data.sub)
		# user = user_model.get(id=request.GET.get('user'))
		if user:
			games_list = get_games_list(user=user)
			return JsonResponse({"message": f"Game request list retrieved with success.", "games_list": games_list}, status=200)
		else:
			return JsonResponse({"message": "Error: Invalid User!"}, status=400)
