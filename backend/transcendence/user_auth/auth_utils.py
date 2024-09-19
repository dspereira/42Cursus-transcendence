from django.utils import timezone
from custom_utils.jwt_utils import TokenGenerator, JwtData
from custom_utils.email_utils import EmailSender
from custom_utils.models_utils import ModelManager
from user_auth.models import User, BlacklistToken
from friendships.models import FriendList
from live_chat.models import ChatRoom
from datetime import datetime
import re

from user_profile.models import UserProfileInfo
from user_settings.models import UserSettings

INVALID_USER_ADMIN_WORDS = ['admin', 'support', 'root', 'moderator', 'administrator', 'owner', 'help', 'contact', 'service', 'management']
INVALID_USER_SPAM_WORDS = ['user', 'username', 'guest', 'test', 'default', 'anonymous', 'newuser', 'member', 'account', 'login', 'signin', 'signup']
INVALID_USER_OFFENSIVE_WORDS = ['racist', 'sexist', 'homophobic', 'bigot', 'hate', 'killer']
INVALID_USER_ILLEGAL_WORDS = ['drugs', 'violence', 'scam', 'fraud', 'pirate']
INVALID_USER_PRIVACY_WORDS = ['private', 'confidential', 'secure']
INVALID_USER_WORDS = INVALID_USER_ADMIN_WORDS + INVALID_USER_SPAM_WORDS + INVALID_USER_OFFENSIVE_WORDS + INVALID_USER_ILLEGAL_WORDS + INVALID_USER_PRIVACY_WORDS

friend_list_model = ModelManager(FriendList)
user_model = ModelManager(User)
chatroom_model = ModelManager(ChatRoom)

def login(response, user):
	user.last_login = timezone.now()
	user.save()
	_set_cookies(response, _generate_tokens(user.id))
	return response

def logout(response):
	response.delete_cookie("access", path="/")
	response.delete_cookie("refresh", path="/api/auth")
	return response

def refresh_token(response, user_id):
	_set_cookies(response, _generate_tokens(user_id))
	return response

def update_blacklist(access_token_data, refresh_token_data):
	if access_token_data:
		try:
			black_listed = BlacklistToken(jti = access_token_data.jti, exp = access_token_data.exp)
			black_listed.save()
		except Exception as e:
			print(f"Error access token: {e}")
	if refresh_token_data:
		try:
			black_listed = BlacklistToken(jti = refresh_token_data.jti, exp = refresh_token_data.exp)
			black_listed.save()
		except Exception as e:
			print(f"Error refresh token: {e}")

def add_email_token_to_blacklist(email_validation_token):
	if email_validation_token:
		blacklist_token_model = ModelManager(BlacklistToken)
		blacklist_token_model.create(jti=email_validation_token.jti, exp=email_validation_token.exp)

def send_email_verification(user):
	token_gen = _generate_email_verification_token(user_id=user.id)
	token = token_gen.get_email_verification_token()
	EmailSender().send_email_verification(receiver_email=user.email, token=token)

def is_jwt_token_valid(token: str):
	jwt_data = JwtData(token=token)
	if jwt_data:
		blacklist_token_model = ModelManager(BlacklistToken)
		if not blacklist_token_model.get(jti=jwt_data.jti):
			return True
	return False

def get_jwt_data(token: str):
	if is_jwt_token_valid(token=token):
		return JwtData(token=token)
	return None

def create_user_profile_info(user):
	user_profile_info_model = ModelManager(UserProfileInfo)

	user_profile = user_profile_info_model.create(
		user=user,
		default_image_seed=user.username
	)
	return user_profile

def create_user_settings(user):
	user_settings_model = ModelManager(UserSettings)

	user_settings = user_settings_model.create(user=user)
	return user_settings

def add_bot_as_friend(user):
	bot_user = user_model.get(username="BlitzPong")
	if not bot_user:
		return None
	friendship = friend_list_model.create(user1=bot_user , user2=user)
	chat_name = str(bot_user.id) + "_" + str(user.id)
	chatroom = chatroom_model.create(name=chat_name)
	if friendship and chatroom:
		return friendship
	return None

def is_valid_username(username: str):
	if username:
		if len(username) > 0 and len(username) <= 15:
			if re.match(r'^[a-zA-Z0-9_-]+$', username):
				for name in INVALID_USER_WORDS:
					if name in username.lower():
						return False
				return True
	return False

def _generate_tokens(user_id):
	token_gen = TokenGenerator(user_id)
	token_gen.generate_tokens()
	return token_gen

def _generate_email_verification_token(user_id):
	token_gen = TokenGenerator(user_id)
	token_gen.generate_email_verification_token()
	return token_gen

def _set_cookies(response, token_gen):
	response.set_cookie(
		key="access",
		value=token_gen.get_access_token(),
		httponly=True,
		expires=token_gen.get_access_token_exp(),
		samesite="Lax",
		path="/"
	)
	response.set_cookie(
		key="refresh",
		value=token_gen.get_refresh_token(),
		httponly=True, expires=token_gen.get_refresh_token_exp(),
		samesite="Lax",
		path="/api/auth"
	)
