from django.db import models
from user_auth.models import User

class ChatRoom(models.Model):
	name = models.CharField(max_length=20)
	online = models.ManyToManyField(to=User, blank=True)

	def get_online_count(self):
		return (self.online.count())

	"""
		User joins the ChatRoom 
	"""
	def join(self, user):
		self.online.aadd(user)
		self.save()

	"""
		User leaves the ChatRoom 
	"""
	def leave(self, user):
		self.online.remove(user)
		self.save()

	def __str__(self):
		return f'{self.id} {self.name} ({self.get_online_count()})'

class Message(models.Model):
	user = models.ForeignKey(to=User, on_delete=models.CASCADE)
	room = models.ForeignKey(to=ChatRoom, on_delete=models.CASCADE)
	content = models.CharField(max_length=2000)
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f'{self.user.username}: {self.content} [{self.timestamp}]'

class ChatRoomUsers(models.Model):
	room = models.ForeignKey(to=ChatRoom, on_delete=models.CASCADE)
	user = models.ForeignKey(to=User, on_delete=models.CASCADE)

	def __str__(self) -> str:
		return f'User: {self.user} | Room: {self.room}'
