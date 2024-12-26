from dotenv import load_dotenv
import os
import jwt

load_dotenv()

secret = os.getenv('JWT_SECRET_KEY')

class JwtData:
	def __init__(self, token: str):
		self.__token = token.strip().encode('utf-8') if token else None
		self.__decode_token()

	def __str__(self):
		return f"{self.__token_data}"

	def __decode_token(self):
		try:
			self.__token_data = jwt.decode(self.__token, secret, algorithms=["HS256"])
		except Exception as e:
			print(f"Erro: {e}", flush=True)  
			self.__token_data = None

	def __getattr__(self, name):
			if self.__token_data and name in self.__token_data:
				return self.__token_data[name]
			else:
				return None
	
	def __bool__(self):
		return bool(self.__token_data)
