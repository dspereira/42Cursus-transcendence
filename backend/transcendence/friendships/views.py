from friendships.friendships import get_friend_list, get_friend_info
from custom_decorators import accepted_methods, login_required
from friendships.models import FriendList, BlockList
from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo
from django.http import JsonResponse
from user_auth.models import User
import json


user_profile_info_model = ModelManager(UserProfileInfo)
friend_list_model = ModelManager(FriendList)
block_list_model = ModelManager(BlockList)
user_model = ModelManager(User)

@login_required
@accepted_methods(["POST"])
def unblock_user(request):
	if request.body:
		user = user_model.get(id=request.access_data.sub)
		if user:
			req_data = json.loads(request.body.decode('utf-8'))
			blocked_user = user_model.get(id=req_data["blocked_user"])
			if blocked_user:
				unblocke_user = block_list_model.get(user=user, blocked_user=blocked_user)
				if unblocke_user:
					unblocke_user.delete()
					result = {
						"message": "User was unblocked"
					}
				else:
					result = {
						"message": "Error: User already unblocked"
					}
			else:
				result = {
					"message": "Error: Can't find user to unblock"
				}
		else:
			result = {
				"message": "Error: Can't find user"
			}
	else:
		result = {
			"message": "Error: Empty Body"
		}
	return JsonResponse(result, safe=False)

@login_required
@accepted_methods(["POST"])
def block_user(request):
	if request.body:
		user = user_model.get(id=request.access_data.sub)
		if user:
			req_data = json.loads(request.body.decode('utf-8'))
			blocked_user = user_model.get(id=req_data["blocked_user"])
			if blocked_user:
				if not block_list_model.get(user=user, blocked_user=blocked_user):
					block_list_model.create(user=user, blocked_user=blocked_user)
					result = {
						"message": "User was blocked"
					}
				else:
					result = {
						"message": "Error: User already blocked"
					}
			else:
				result = {
					"message": "Error: Can't find user to block"
				}
		else:
			result = {
				"message": "Error: Can't find user"
			}
	else:
		result = {
			"message": "Error: Empty Body"
		}
	return JsonResponse(result, safe=False)

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