from custom_utils.models_utils import ModelManager
from live_chat.models import ChatRoom, Message
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async, async_to_sync
from user_profile.utils import get_image_url
from user_profile.models import UserProfileInfo
from datetime import datetime
from user_auth.models import User
from friendships.friendships import get_friendship

room_model = ModelManager(ChatRoom)
msg_model = ModelManager(Message)
user_profile_model = ModelManager(UserProfileInfo)
user_model = ModelManager(User)

def generate_welcome_message(username):
	msg = f"""Welcome to <strong>Blitzpong</strong>, {username} 🎉\nGet ready to dive into fast-paced pong action! Here, you can:\n
🎮 <strong>Play exciting games and tournaments</strong>\nWhether you're going solo or competing with friends, there's always a game waiting for you.\n  
👥 <strong>Add friends and grow your network</strong>\nBuild your community and challenge your friends to see who's the best.\n
💬 <strong>Chat with your friends</strong>\nStay connected, discuss strategies, or just hang out between matches.\n
Join the fun, make new friends, and become the ultimate pong champion! Let the games begin!
"""
	return msg

def send_custom_bot_message(user, message):
	if not user or not message:
		return
	bot_user = user_model.get(username="BlitzPong")
	friendship = get_friendship(bot_user, user)
	group_name = str(bot_user.id) + "_" + str(user.id)
	room = room_model.get(name=group_name)
	if not friendship or not room:
		return
	message_obj = msg_model.create(user=bot_user, room=room, content=message)
	if not message_obj:
		return
	async_to_sync(send_message)(bot_user, friendship, group_name, message_obj)

async def send_message(user, friendship, group_name, message):
	channel_layer = get_channel_layer()
	if channel_layer:
		message_content = message.content
		timestamp = int(datetime.fromisoformat(str(message.timestamp)).timestamp())
		await __update_last_chat_interaction(friendship=friendship, last_chat_timestamp=message.timestamp)
		if group_name:
			await channel_layer.group_send(
				group_name,
				{
					'type': 'send_message_to_friend',
					'message': message_content,
					'id': user.id,
					'timestamp': timestamp,
					'user_image': await sync_to_async(__get_profile_picture)(user=user),
					"room": group_name
				}
			)

async def __update_last_chat_interaction(friendship, last_chat_timestamp):
	friendship.last_chat_interaction = last_chat_timestamp
	await sync_to_async(friendship.save)()

def __get_profile_picture(user):
	user_profile = user_profile_model.get(user=user)
	image = get_image_url(user_profile)
	return image
