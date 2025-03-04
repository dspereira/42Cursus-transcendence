from custom_utils.jwt_utils import JwtData

ACCESS_TOKEN = "access"
REFRESH_TOKEN = "refresh"
TFA_TOKEN = "two_factor_auth"

class JwtMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		access_token = self.__get_token(request, ACCESS_TOKEN)
		refresh_token = self.__get_token(request, REFRESH_TOKEN)
		tfa_token = self.__get_token(request, TFA_TOKEN)
		access_data = JwtData(access_token)
		refresh_data =JwtData(refresh_token)
		tfa_data =JwtData(tfa_token)
		if access_data and access_data.type != ACCESS_TOKEN:
			access_data = None
		if refresh_data and refresh_data.type != REFRESH_TOKEN:
			refresh_data = None
		if tfa_data and tfa_data.type != TFA_TOKEN:
			tfa_data = None
		setattr(request, "access_data", access_data)
		setattr(request, "refresh_data", refresh_data)
		setattr(request, "tfa_data", tfa_data)
		return self.get_response(request)

	def __get_token(self, request, token_type):
		return request.COOKIES.get(token_type)
