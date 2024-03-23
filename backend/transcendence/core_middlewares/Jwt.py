#import jwt

from custom_utils.jwt_utils import JwtData

ACCESS_TOKEN = "access"
REFRESH_TOKEN = "refresh"

class Jwt:
	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		access_token = self.__get_token(request, ACCESS_TOKEN)
		refresh_token = self.__get_token(request, REFRESH_TOKEN)
		setattr(request, "access_data", JwtData(access_token))
		setattr(request, "refresh_data", JwtData(refresh_token))
		return self.get_response(request)

	def __get_token(self, request, token_type):
		return request.COOKIES.get(token_type)
