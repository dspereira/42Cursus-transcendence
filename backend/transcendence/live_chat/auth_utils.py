from custom_utils.jwt_utils import JwtData
from custom_utils.models_utils import ModelManager
from user_auth.models import BlacklistToken

def is_authenticated(token):
	access_data = JwtData(token)		
	if access_data:
		blacklist_model = ModelManager(BlacklistToken)
		if not blacklist_model.get(jti=access_data.jti):
			return True
	return False