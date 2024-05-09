from django.db import models
from user_auth.models import User
from live_chat.models import ChatRoom

class FriendsRequestNotification(models.Model):
	from_user = models.ForeignKey(User, related_name='from_user_friend_req', on_delete=models.CASCADE)
	to_user = models.ForeignKey(User, related_name='to_user_friend_req', on_delete=models.CASCADE, db_index=True)

	def __str__(self) -> str:
		return f"--------------------\nFrom: {self.from_user}\nTo: {self.to_user}\n--------------------\n"

	class Meta:
		db_table = 'notifications_friend_request'

class ChatRoomInviteNotification(models.Model):
	from_user = models.ForeignKey(User, related_name='from_user_chatroom_inv', on_delete=models.CASCADE)
	to_user = models.ForeignKey(User, related_name='to_user_chatroom_inv', on_delete=models.CASCADE, db_index=True)
	chatroom = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)

	def __str__(self) -> str:
		return f"--------------------\nFrom: {self.from_user}\nTo: {self.to_user}\nChatRoom: {self.chatroom}\n--------------------\n"

	class Meta:
		db_table = 'notifications_chatroom_invite'

class GameInviteNotification(models.Model):
	from_user = models.ForeignKey(User, related_name='from_user_game_inv', on_delete=models.CASCADE)
	to_user = models.ForeignKey(User, related_name='to_user_game_inv', on_delete=models.CASCADE, db_index=True)
	game = models.IntegerField()

	def __str__(self) -> str:
		return f"--------------------\nFrom: {self.from_user}\nTo: {self.to_user}\nGame: {self.game}\n--------------------\n"

	class Meta:
		db_table = 'notifications_game_invite'
