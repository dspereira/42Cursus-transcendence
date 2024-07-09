from custom_utils.models_utils import ModelManager
from user_profile.models import UserProfileInfo

class OnlineStatusMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response
		self.initialized = False

	def __call__(self, request):
		if not self.initialized:
			self.initialized = True
			self.reset_users_online_status()
		response = self.get_response(request)
		return response

	def reset_users_online_status(self):
		user_profile_model = ModelManager(UserProfileInfo)		
		users = user_profile_model.all()
		if users:
			for user in users:
				user.online = 0
				user.save()
			for profile in users:
				if profile.online:
					print("Failed to reset the online statuses of all users. Please restart the server.")
					return
			print("All users' online statuses have been successfully reset.")
		else:
			print("Users list is empty no statuses to reset.")
