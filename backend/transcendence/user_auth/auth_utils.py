from django.utils import timezone
from custom_utils.jwt_utils import TokenGenerator
from user_auth.models import BlacklistToken

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

def _generate_tokens(user_id):
	token_gen = TokenGenerator(user_id)
	token_gen.generate_tokens()
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