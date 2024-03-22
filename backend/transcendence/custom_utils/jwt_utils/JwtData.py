import jwt

class JwtData:
	def __init__(self, token: str):
		self.__token = token
		self.__decode_token()

	def __str__(self):
		return f"{self.__token_data}"

	def __decode_token(self):
		try:
			self.__token_data = jwt.decode(self.__token, "your-256-bit-secret", algorithms="HS256")
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