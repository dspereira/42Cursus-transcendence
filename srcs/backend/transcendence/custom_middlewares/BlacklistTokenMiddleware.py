from custom_utils.models_utils import ModelManager
from user_auth.models import BlacklistToken

class BlacklistTokenMiddleware:

	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		blacklist_model = ModelManager(BlacklistToken)

		if request.access_data and blacklist_model.get(jti=request.access_data.jti):
			request.access_data = None
		if request.refresh_data and blacklist_model.get(jti=request.refresh_data.jti):
			request.refresh_data = None
		return self.get_response(request)
