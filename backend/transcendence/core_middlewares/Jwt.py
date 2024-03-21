import jwt

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

class JwtData:
	def __init__(self, _token):
		self.token = _token
		self.__decode_token()

	def __str__(self):
		return f"{self.__token_data}"

	def __decode_token(self):
		try:
			self.__token_data = jwt.decode(self.token, "your-256-bit-secret", algorithms="HS256")
		except Exception:
			self.__token_data = None

	def __getattr__(self, name):
			if self.__token_data and name in self.__token_data:
				return self.__token_data[name]
			else:
				return None
				#raise AttributeError(f"{type(self)} object has no attribute '{name}'")
	
	def __bool__(self):
		return bool(self.__token_data)

