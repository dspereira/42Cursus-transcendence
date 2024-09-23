import jwt
import uuid
from datetime import datetime, timedelta

ACCESS_TOKEN = "access"
REFRESH_TOKEN = "refresh"
EMAIL_VERIFICATION_TOKEN = "email_verification"
ACCESS_TOKEN_EXP_MIN = 1
REFRESH_TOKEN_EXP_DAY = 1
EMAIL_VERIFICATION_TOKEN_EXP_MIN = 5

class TokenGenerator:
	def __init__(self, user_id: int):
		self.__user_id = user_id
		self.__access_token = None
		self.__refresh_token = None
		self.__email_verification_token = None
		self.__access_exp = None
		self.__refresh_exp = None
		self.__email_verification_exp = None

	def generate_access_token(self):
		self.__access_token = self.__generate_token(ACCESS_TOKEN)

	def generate_refresh_token(self):
		self.__refresh_token = self.__generate_token(REFRESH_TOKEN)

	def generate_tokens(self):
		self.generate_access_token()
		self.generate_refresh_token()

	def generate_email_verification_token(self):
		self.__email_verification_token = self.__generate_token(EMAIL_VERIFICATION_TOKEN)

	def get_access_token(self):
		self.__check_token_exists(ACCESS_TOKEN)
		return self.__access_token

	def get_refresh_token(self):
		self.__check_token_exists(REFRESH_TOKEN)
		return self.__refresh_token

	def get_email_verification_token(self):
		self.__check_token_exists(EMAIL_VERIFICATION_TOKEN)
		return self.__email_verification_token

	def get_access_token_exp(self):
		self.__check_token_exists(ACCESS_TOKEN)
		return self.__access_exp

	def get_refresh_token_exp(self):
		self.__check_token_exists(REFRESH_TOKEN)
		return self.__refresh_exp

	def get_email_verification_token_exp(self):
		self.__check_token_exists(EMAIL_VERIFICATION_TOKEN)
		return self.__email_verification_exp

	def __generate_token(self, token_type):
		iat = datetime.now()
		if token_type == ACCESS_TOKEN:
			exp = iat + timedelta(minutes=ACCESS_TOKEN_EXP_MIN)
			self.__access_exp = exp
		elif token_type == REFRESH_TOKEN:
			exp = iat + timedelta(days=REFRESH_TOKEN_EXP_DAY)
			self.__refresh_exp = exp
		else:
			exp = iat + timedelta(minutes=EMAIL_VERIFICATION_TOKEN_EXP_MIN)
			self.__email_verification_exp = exp
		token = jwt.encode(
			{
				"type": token_type,
				"sub": self.__user_id,
				"iat": iat,
				"exp": exp,
				"jti": str(uuid.uuid4())
			},
			"your-256-bit-secret",
			algorithm='HS256'
		)
		return token

	def __check_token_exists(self, token_type):
		if token_type == ACCESS_TOKEN and not self.__access_token:
			raise ValueError("Access token has not yet been generated. First execute generate_tokens() or generate_access_token()")
		elif token_type == REFRESH_TOKEN and not self.__refresh_token:
			raise ValueError("Refresh token has not yet been generated. First execute generate_tokens() or generate_refresh_token()")
		elif token_type == EMAIL_VERIFICATION_TOKEN and not self.__email_verification_token:
			raise ValueError("Email verification token has not yet been generated. First execute generate_tokens() or generate_email_verification_token()")
