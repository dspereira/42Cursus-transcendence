from datetime import datetime
from custom_utils.jwt_utils import JwtData
from custom_utils.models_utils import ModelManager
from user_auth.models import BlacklistToken
from user_auth.models import User
import re

INVALID_USER_ADMIN_WORDS = ['admin', 'support', 'root', 'moderator', 'administrator', 'owner', 'help', 'contact', 'service', 'management']
INVALID_USER_SPAM_WORDS = ['user', 'username', 'guest', 'test', 'default', 'anonymous', 'newuser', 'member', 'account', 'login', 'signin', 'signup']
INVALID_USER_OFFENSIVE_WORDS = ['racist', 'sexist', 'homophobic', 'bigot', 'hate', 'killer']
INVALID_USER_ILLEGAL_WORDS = ['drugs', 'violence', 'scam', 'fraud', 'pirate']
INVALID_USER_PRIVACY_WORDS = ['private', 'confidential', 'secure']
INVALID_USER_WORDS = INVALID_USER_ADMIN_WORDS + INVALID_USER_SPAM_WORDS + INVALID_USER_OFFENSIVE_WORDS + INVALID_USER_ILLEGAL_WORDS + INVALID_USER_PRIVACY_WORDS

user_model = ModelManager(User)

def is_authenticated(access_data):
	if access_data:
		if access_data.exp >= int(datetime.now().timestamp()):
			blacklist_model = ModelManager(BlacklistToken)
			if not blacklist_model.get(jti=access_data.jti):
				return True
	return False

def get_authenticated_user(user_id):
	user = user_model.get(id=user_id)
	if user:
		return user
	return None

def is_username_bot_username(username):
	bot_username = "blitzpong"
	if  bot_username in username.lower():
		return True
	return False

def is_bot_user(user_id):
	bot_user = user_model.get(username="BlitzPong")
	if bot_user and user_id == str(bot_user.id):
		return True
	return False

def is_valid_username(username: str):
	if username:
		if len(username) > 0 and len(username) <= 15:
			if re.match(r'^[a-zA-Z0-9_-]+$', username):
				for name in INVALID_USER_WORDS:
					if name in username.lower():
						return False
				return True
	return False
