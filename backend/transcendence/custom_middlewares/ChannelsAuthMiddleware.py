from custom_utils.jwt_utils import JwtData
from channels.middleware import BaseMiddleware
from user_auth.models import User
from live_chat.models import ChatRoom, ChatRoomUsers
from custom_utils.models_utils import ModelManager

from asgiref.sync import sync_to_async

class ChannelsAuthMiddleware(BaseMiddleware):

	async def __call__(self, scope, receive, send):
		scope['access_data'] = JwtData(self.__getAccessToken(scope))
		scope['room_id'] = None
		if scope['access_data']:
			room_id = self.__getRoomId(scope['query_string'])
			print("Scope Room ID -> ", scope['room_id'])
			if await self.__isUserAllowedInChatRoom(scope['access_data'].sub, room_id):
				scope['room_id'] = room_id
		return await super().__call__(scope, receive, send)

	def __getAccessToken(self, scope):
		for header_name, header_value in scope['headers']:
			if header_name == b'cookie':
				cookies = header_value.decode('utf-8').split('; ')
				for cookie in cookies:
					cookie_name, cookie_value = cookie.split('=')
					if cookie_name == 'access':
						return cookie_value

	async def __isUserAllowedInChatRoom(self, user_id, room_id):
		if user_id and room_id:
			user_model = ModelManager(User)
			chatroom_model = ModelManager(ChatRoom)
			chatroom_users_model = ModelManager(ChatRoomUsers)
			user = await sync_to_async(user_model.get)(id=user_id)
			room = await sync_to_async(chatroom_model.get)(id=room_id)
			if user and room:
				chatroom_users = await sync_to_async(chatroom_users_model.get)(user=user, room=room)
				if chatroom_users:
					print(" ele tem acesso a esta sala!")
					return True
		return False

	def __getRoomId(self, query_string: bytes):
		query_str = query_string.decode('utf-8')
		key, value = query_str.split('=')
		if key == "room_id" and value:
			return value
		return None
