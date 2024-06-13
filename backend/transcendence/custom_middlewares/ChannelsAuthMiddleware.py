from custom_utils.jwt_utils import JwtData
from channels.middleware import BaseMiddleware
from user_auth.models import User
from live_chat.models import ChatRoom, ChatRoomUsers
from custom_utils.models_utils import ModelManager

from asgiref.sync import sync_to_async

class ChannelsAuthMiddleware(BaseMiddleware):

	async def __call__(self, scope, receive, send):
		scope['access_data'] = JwtData(self.__getAccessToken(scope))
		return await super().__call__(scope, receive, send)

	def __getAccessToken(self, scope):
		for header_name, header_value in scope['headers']:
			if header_name == b'cookie':
				cookies = header_value.decode('utf-8').split('; ')
				for cookie in cookies:
					if not cookie.find("access="):
						token = cookie.replace("access=", "")
						print(f"Cookie: {token}")
						return token
