from .EmailVerificationWaitManager import EmailVerificationWaitManager
from custom_utils.jwt_utils import TokenGenerator, JwtData
from custom_utils.email_utils import EmailSender
from custom_utils.models_utils import ModelManager
from user_auth.models import User, BlacklistToken
from friendships.models import FriendList
from live_chat.models import ChatRoom
from django.utils import timezone
from datetime import datetime
import math
import re

from two_factor_auth.models import OtpUserOptions
from user_profile.models import UserProfileInfo
from user_settings.models import UserSettings

friend_list_model = ModelManager(FriendList)
user_model = ModelManager(User)
chatroom_model = ModelManager(ChatRoom)
otp_user_opt_model = ModelManager(OtpUserOptions)
black_list_token_model = ModelManager(BlacklistToken)

def two_factor_auth(response, user):
	user.last_login = timezone.now()
	user.save()
	_set_tfa_cookie(response, _generate_tfa_token(user.id))
	return response

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
	response.delete_cookie("access", path="/")
	response.delete_cookie("refresh", path="/")
	_set_cookies(response, _generate_tokens(user_id))
	return response

def update_blacklist(access_token_data, refresh_token_data):
	if access_token_data:
		access_token_blacklisted = black_list_token_model.create(jti=access_token_data.jti, exp=access_token_data.exp)
		if not access_token_blacklisted:
			return False
	if refresh_token_data:
		refresh_token_blacklisted = black_list_token_model.create(jti=refresh_token_data.jti, exp=refresh_token_data.exp)
		if not refresh_token_blacklisted:
			return False
	return True

def add_email_token_to_blacklist(email_validation_token):
	if email_validation_token:
		blacklist_token_model = ModelManager(BlacklistToken)
		blacklist_token_model.create(jti=email_validation_token.jti, exp=email_validation_token.exp)

def send_email_verification(user):
	token_gen = _generate_email_verification_token(user_id=user.id)
	token = token_gen.get_email_verification_token()
	EmailSender().send_email_verification(receiver_email=user.email, token=token)
	otp_options = otp_user_opt_model.get(user=user)
	if otp_options:
		EmailVerificationWaitManager().new_code_sended(otp_options, datetime.now().timestamp())

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

def is_email_verified(user):
	if user and user.active:
		return True
	return False

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

def get_new_email_wait_time(user):
	wait_time_str = None
	wait_time = None
	if user:
		otp_options = otp_user_opt_model.get(user=user)
		if otp_options:
			wait_time = EmailVerificationWaitManager().get_wait_time(otp_options)
		if wait_time:
			time_now = datetime.now().timestamp()
			if wait_time > time_now:
				new_wait_time = (wait_time - time_now) / 60
				if new_wait_time <= 0.3:
					wait_time_str = "30 seconds left"
				else:
					wait_time_str = f"{math.floor(new_wait_time) + 1} minute(s)"
	return wait_time_str

def is_valid_password(password: str):
	password_requirements = {
		"length": False,
		"lower_character": False,
		"upper_character": False,
		"special_character": False,
		"digit": False,
		"white_character": False
	}
	if not password:
		return password_requirements
	password_len = len(password)
	if password_len >= 8 and password_len <= 25:
		password_requirements["length"] = True
	if re.search(r'[a-z]', password):
		password_requirements["lower_character"] = True
	if re.search(r'[A-Z]', password):
		password_requirements["upper_character"] = True
	if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
		password_requirements["special_character"] = True
	if re.search(r'[0-9]', password):
		password_requirements["digit"] = True
	if not re.search(r'\s', password):
		password_requirements["white_character"] = True
	for req in password_requirements:
		if not password_requirements[req]:
			return password_requirements
	return None

def is_valid_email(email: str):
	if email:
		email_len = len(email)
		if email_len >= 5 and email_len <= 254:
			print("\nHere\n")
			if re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$', email):
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

def _generate_tfa_token(user_id):
	token_gen = TokenGenerator(user_id)
	token_gen.generate_tfa_token()
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
		httponly=True,
		expires=token_gen.get_refresh_token_exp(),
		samesite="Lax",
		path="/"
	)

def _set_tfa_cookie(response, token):
	response.set_cookie(
		key="two_factor_auth",
		value=token.get_tfa_token(),
		httponly=True, expires=token.get_tfa_token_exp(),
		samesite="Lax",
		path="/api/two-factor-auth"
	)
