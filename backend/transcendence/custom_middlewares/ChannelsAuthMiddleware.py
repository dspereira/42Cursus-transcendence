from custom_utils.jwt_utils import JwtData
from channels.middleware import BaseMiddleware

class ChannelsAuthMiddleware(BaseMiddleware):
	async def __call__(self, scope, receive, send):
		scope['access_data'] = JwtData(self.__getAccessToken(scope))
		return await super().__call__(scope, receive, send)
	
	def __getAccessToken(self, scope):
		for header_name, header_value in scope['headers']:
			if header_name == b'cookie':
				cookies = header_value.decode('utf-8').split('; ')
				for cookie in cookies:
					cookie_name, cookie_value = cookie.split('=')
					if cookie_name == 'access':
						return cookie_value
