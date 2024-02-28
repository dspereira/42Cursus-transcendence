import jwt

class Jwt:

	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):

		self.token_validation(request)

		return self.get_response(request)
	
	def token_validation(self, request):


		token = request.COOKIES.get("jwt_token")
	
		try:
			jwt_data = jwt.decode(token, "your-256-bit-secret", algorithms="HS256")
		except Exception as e:
			print(e)
			jwt_data = ""

		if jwt_data:
			request.jwt_data = jwt_data
			setattr(request, "jwt_data", jwt_data)
		else:
			print("Não validou")

		#print(data)

		#setattr(request, "username", data.get("username"))
		#setattr(request, "user_id", data.get("user_id"))
		#setattr(request, "is_authenticated", True)



