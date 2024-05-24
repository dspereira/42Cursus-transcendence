from friendships.friendships import get_friend_list, get_friend_info
from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from friendships.models import FriendList
from django.http import JsonResponse
from user_auth.models import User
import json


user_profile_info_model = ModelManager(UserProfileInfo)
friend_list_model = ModelManager(FriendList)
user_model = ModelManager(User)

'''
@accepted_methods(["POST"])
def force_friendship(request):
	if request.body:
		req_data = json.loads(request.body)
		user1 = user_model.get(id=req_data["user1"])
		user2 = user_model.get(id=req_data["user2"])
		friend_list_model.create(user1=user1 , user2=user2)
		result = {"message": "friendship made",
					"user1": user1.id,
					"user2": user2.id}
	else:
		result = {"message": "no body" }
	return JsonResponse(result)
'''

@login_required
@accepted_methods(["GET"])
def get_friends(request):
	user = user_profile_info_model.get(user_id=request.access_data.sub)
	if user:
		friend_list_left = get_friend_list(user.id, "left")
		friend_list_right = get_friend_list(user.id, "right")
		if not friend_list_left and not friend_list_right:
			result = {
			"message": "User has no friends"
		}
		else:
			result = []
			if friend_list_left:
				for friendship in friend_list_left:
					result.append(get_friend_info(friendship, "right"))
			if friend_list_right:
				for friendship in friend_list_right:
					result.append(get_friend_info(friendship, "left"))
	else:
		result = {
			"message": "Error: Can't find user"
		}
	return JsonResponse(result, safe=False)