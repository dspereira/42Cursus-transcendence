from django.http import JsonResponse

import jwt

public_routes = {
	"/user/api/login": True,
	"/user/api/login/": True,
	"/user/api/logout": True,
	"/user/api/logout/": True,
	"/user/api/signin": True,
	"/user/api/signin/": True,
	"/user/api/token": True,
	"/user/api/token/": True,
	#"/user/api/token/refresh": True,
	#"/user/api/token/refresh/": True,

}

ACCESS_TOKEN = "access"
REFRESH_TOKEN = "refresh"

class Jwt:

	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request): 
		if request.path == "/user/api/token/refresh" or request.path == "/user/api/token/refresh/":
			token_type = REFRESH_TOKEN
		else:
			token_type = ACCESS_TOKEN
		token = self.get_token(request, token_type)
		token_data, error_msg = self.validate_token(token)
		if error_msg and not public_routes.get(request.path):
			return JsonResponse({"message": error_msg}, status=401)
		elif token_data and token_type != token_data.get("token_type"):
			return JsonResponse({"message": "Invalid token type"}, status=401)
		else:
			self.set_token_data(request, token_data)
		return self.get_response(request)

	def get_token(self, request, token_type):
		return request.COOKIES.get(token_type)

	def validate_token(self, token):
		error_msg = None
		token_data = None
		try:
			token_data = jwt.decode(token, "your-256-bit-secret", algorithms="HS256")
		except jwt.exceptions.ExpiredSignatureError:
			error_msg = "Authentication token has expired"
		except jwt.exceptions.InvalidSignatureError:
			error_msg = "Authentication token has invalid signature"
		except Exception as e:
			error_msg = "Authentication token has invalid"
		return token_data, error_msg

	def set_token_data(self, request, token_data):
		setattr(request, "token_data", token_data)
