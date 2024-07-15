from custom_decorators import accepted_methods, login_required
from friendships.models import FriendList, FriendRequests
from custom_utils.models_utils import ModelManager
from django.http import JsonResponse
from user_auth.models import User
import json

from .utils import has_already_valid_game_request

user_model = ModelManager(User)

@accepted_methods(["GET"])
def test(request):
	user = user_model.get(id=request.GET.get('user'))
	friend = user_model.get(id=request.GET.get('id'))

	if user and friend and user.id != friend.id:
		has_already_valid_game_request(user1=user, user2=friend)

	return JsonResponse({"message": "Test Message"}, status=200)
