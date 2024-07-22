from custom_utils.jwt_utils import JwtData
from channels.middleware import BaseMiddleware
import re

class ChannelsAuthMiddleware(BaseMiddleware):

	async def __call__(self, scope, receive, send):
		scope['access_data'] = JwtData(self.__getAccessToken(scope))

		if self.__isGameSocket(scope['path']):
			scope['game_id'] = self.__getGameId(scope['path'])

		return await super().__call__(scope, receive, send)

	def __getAccessToken(self, scope):
		for header_name, header_value in scope['headers']:
			if header_name == b'cookie':
				cookies = header_value.decode('utf-8').split('; ')
				for cookie in cookies:
					if not cookie.find("access="):
						token = cookie.replace("access=", "")
						return token

	def __getGameId(self, path):
		match = re.search(r'/game/(?P<game_id>\d+)/', path)
		if match:
			return match.group('game_id')

	def __isGameSocket(self, path):
		return path.startswith('/game/')
