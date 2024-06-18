from user_auth.models import User
from django.db import models

class FriendRequests(models.Model):
	from_user = models.ForeignKey(User, related_name='from_user_friend_req', on_delete=models.CASCADE)
	to_user = models.ForeignKey(User, related_name='to_user_friend_req', on_delete=models.CASCADE, db_index=True)
	timestamp = models.DateTimeField(auto_now_add=True)
	read = models.BooleanField(default=False)

	def __str__(self) -> str:
		return f"--------------------\nFrom: {self.from_user}\nTo: {self.to_user}\nTime: {self.timestamp}\nRead: {self.read}\n--------------------"

	class Meta:
		db_table = 'friend_request'


class FriendList(models.Model):
	user1 = models.ForeignKey(to=User, related_name='first', on_delete=models.CASCADE, db_index=True)
	user2 = models.ForeignKey(to=User, related_name='second', on_delete=models.CASCADE, db_index=True)

	def __str__(self) -> str:
		return f'User1: {self.user1} | User2: {self.user2}'
	
	class Meta:
		db_table = 'friend_list'

class BlockList(models.Model):
	user = models.ForeignKey(to=User, related_name='blocker', on_delete=models.CASCADE)
	blocked_user = models.ForeignKey(to=User, related_name='blocked', on_delete=models.CASCADE)

	def __str__(self) -> str:
		return f'User: {self.user1} | Blocked: {self.user2}'
	
	class Meta:
		db_table = 'block_list'