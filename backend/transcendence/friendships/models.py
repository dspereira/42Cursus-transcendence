from asgiref.sync import sync_to_async
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
	user1_block = models.BooleanField(default=False)
	user2_block = models.BooleanField(default=False)
	last_chat_interaction = models.DateTimeField(null=True)

	async def async_str(self):
		user1 = await sync_to_async(lambda: self.user1)()
		user2 = await sync_to_async(lambda: self.user2)()
		return f'User1: {user1} | User2: {user2}'

	def __str__(self) -> str:
		return f'User1: {self.user1} | User2: {self.user2}'
	
	class Meta:
		db_table = 'friend_list'
