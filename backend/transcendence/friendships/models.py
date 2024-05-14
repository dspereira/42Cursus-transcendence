from django.db import models
from user_auth.models import User

class FriendRequests(models.Model):
	from_user = models.ForeignKey(to=User, related_name='from_user', on_delete=models.CASCADE)
	to_user = models.ForeignKey(to=User, related_name='to_user', on_delete=models.CASCADE)
	
	def __str__(self) -> str:
		return f'From: {self.user1} | To: {self.user2}'
	
	class Meta:
		db_table = 'friend_requests'


class FriendList(models.Model):
	user1 = models.ForeignKey(to=User, related_name='first', on_delete=models.CASCADE)
	user2 = models.ForeignKey(to=User, related_name='second', on_delete=models.CASCADE)

	def __str__(self) -> str:
		return f'User1: {self.user1} | User2: {self.user2}'
	
	class Meta:
		db_table = 'friend_list'