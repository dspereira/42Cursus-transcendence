from django.http import JsonResponse

import jwt


# Issue here that needs to be addressed
# "/user/api/login" or "/user/api/login/" yield different results, which is incorrect

public_routes = {
	"/user/api/login": True,
	"/user/api/logout": True,
	"/user/api/signin": True,
	"/user/api/token": True,
	"/user/api/token/refresh": True
}

class Jwt:

	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		token = self.get_token(request)
		token_data, error_msg = self.validate_token(token)
		if error_msg and not public_routes.get(request.path):
			return JsonResponse({"message": error_msg}, status=401)
		else:
			self.set_user_data(request, token_data)
		return self.get_response(request)

	def get_token(self, request):
		return request.COOKIES.get("access")

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

	def set_user_data(self, request, token_data):
		user_data = None
		if token_data:
			user_data = {
				"id": token_data.get("sub"),
				"username": token_data.get("name"),
				"is_authenticated": True
			}
		else:
			user_data = {
				"is_authenticated": False
			}
		setattr(request, "user_data", user_data)
