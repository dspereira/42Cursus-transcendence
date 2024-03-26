from user_management.models import UserAccount

EMAIL_TYPE = "email"
USERNAME_TYPE = "username"

class AuthBackend:
	def authenticate(self, request, email_username=None, password=None):
		user = self.__try_get_user(email_username, EMAIL_TYPE)
		if not user:
			user = self.__try_get_user(email_username, USERNAME_TYPE)
		if user and user.check_password(password):
			return user
		return None

	def get_user(self, user_id):
		try:
			return UserAccount.objects.get(pk=user_id)
		except UserAccount.DoesNotExist:
			return None		

	def __try_get_user(self, email_username, type):
		try:
			if type == EMAIL_TYPE:
				user = UserAccount.objects.get(email=email_username)
			else:
				user = UserAccount.objects.get(username=email_username)
			return user
		except UserAccount.DoesNotExist:
			return None
