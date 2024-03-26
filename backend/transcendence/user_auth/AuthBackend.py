from user_auth.models import User

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
			return User.objects.get(pk=user_id)
		except User.DoesNotExist:
			return None		

	def __try_get_user(self, email_username, type):
		try:
			if type == EMAIL_TYPE:
				user = User.objects.get(email=email_username)
			else:
				user = User.objects.get(username=email_username)
			return user
		except User.DoesNotExist:
			return None
