from datetime import datetime
from custom_utils.jwt_utils import JwtData
from custom_utils.models_utils import ModelManager
from user_auth.models import BlacklistToken
from user_auth.models import User

def is_authenticated(access_data):
	if access_data:
		if access_data.exp >= int(datetime.now().timestamp()):
			blacklist_model = ModelManager(BlacklistToken)
			if not blacklist_model.get(jti=access_data.jti):
				return True
	return False

def get_authenticated_user(user_id):
	user_model = ModelManager(User)
	user = user_model.get(id=user_id)
	if user:
		return user
	return None
