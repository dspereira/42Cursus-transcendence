from django.db import models
from user_auth.models import User
from live_chat.models import ChatRoom

class FriendsRequestNotification(models.Model):
	from_user = models.ForeignKey(User, related_name='from_user_friend_req', on_delete=models.CASCADE)
	to_user = models.ForeignKey(User, related_name='to_user_friend_req', on_delete=models.CASCADE, db_index=True)
	timestamp = models.DateTimeField(auto_now_add=True)
	read = models.BooleanField(default=False)

	def __str__(self) -> str:
		return f"--------------------\nFrom: {self.from_user}\nTo: {self.to_user}\nTime: {self.timestamp}\nRead: {self.read}\n--------------------"

	def get_data(self):
		return {
			"id": self.id,
			"from_user": self.from_user.username,
			"to_user": self.to_user.username,
			"timestamp": self.timestamp.timestamp(),
			"read": self.read,
			"type": "friend_request",
			"message": f"{self.from_user.username} wants to be your friend!"
		}

	class Meta:
		db_table = 'notifications_friend_request'

class GameInviteNotification(models.Model):
	from_user = models.ForeignKey(User, related_name='from_user_game_inv', on_delete=models.CASCADE)
	to_user = models.ForeignKey(User, related_name='to_user_game_inv', on_delete=models.CASCADE, db_index=True)
	game = models.IntegerField()
	timestamp = models.DateTimeField(auto_now_add=True)
	read = models.BooleanField(default=False)

	def __str__(self) -> str:
		return f"--------------------\nFrom: {self.from_user}\nTo: {self.to_user}\nGame: {self.game}\nTime: {self.timestamp}\nRead: {self.read}\n--------------------"

	def get_data(self):
		return {
			"id": self.id,
			"from_user": self.from_user.username,
			"to_user": self.to_user.username,
			"timestamp": self.timestamp.timestamp(),
			"read": self.read,
			"game": self.game,
			"type": "game_invite",
			"message": f"{self.from_user.username} invited you to a game."
		}

	class Meta:
		db_table = 'notifications_game_invite'
