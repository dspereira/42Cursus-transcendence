from custom_utils.jwt_utils import JwtData

class ChannelsAuthMiddleware:

	def __init__(self, app):
		self.app = app

	def __call__(self, scope, receive, send):
		if scope['type'] == "websocket":
			access_data = JwtData(self.__getAccessToken(scope))
			scope['access_data'] = access_data
		return self.app(scope, receive, send)

	def __getAccessToken(self, scope):
		for header_name, header_value in scope['headers']:
			if header_name == b'cookie':
				cookies = header_value.decode('utf-8').split('; ')
				for cookie in cookies:
					cookie_name, cookie_value = cookie.split('=')
					if cookie_name == 'access':
						return cookie_value
