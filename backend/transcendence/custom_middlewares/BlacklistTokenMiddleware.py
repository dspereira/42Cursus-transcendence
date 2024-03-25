from user_management.models import BlacklistToken

class BlacklistTokenMiddleware:

	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		if self.__get_blacklist_token(request.access_data):
			request.access_data = None
		if self.__get_blacklist_token(request.refresh_data):
			request.access_data = None
		return self.get_response(request)
	
	def __get_blacklist_token(self, token_data):
		if token_data:
			return None
		try:
			blacklist_token = BlacklistToken.objects.get(jti=token_data.access_data.jti)
		except:
			blacklist_token = None
		return blacklist_token
