from django.db import models
from user_auth.models import User

class ChatRoom(models.Model):
	name = models.CharField(max_length=20)

	def __str__(self):
		return f'{self.id} {self.name}'

class Message(models.Model):
	user = models.ForeignKey(to=User, on_delete=models.CASCADE)
	room = models.ForeignKey(to=ChatRoom, on_delete=models.CASCADE)
	content = models.CharField(max_length=2000)
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f'{self.user.username}: {self.content} [{self.timestamp}]'
