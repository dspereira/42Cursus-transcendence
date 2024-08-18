from django.db import models
from user_auth.models import User

class Games(models.Model):
	user1 = models.ForeignKey(to=User, related_name='game_user_1', on_delete=models.SET_NULL, null=True)
	user2 = models.ForeignKey(to=User, related_name='game_user_2', on_delete=models.SET_NULL, null=True)
	user1_score = models.IntegerField(default=0)
	user2_score = models.IntegerField(default=0)
	winner = models.ForeignKey(to=User, related_name='game_winner', on_delete=models.SET_NULL, null=True)
	status = models.CharField(default="created")

	def __str__(self) -> str:
		return f'User1: {self.user1}\nUser2: {self.user2}\nUser1 Score: {self.user1_score}\nUser2 Score: {self.user2_score}\nStatus: {self.status}\nWinner: {self.winner}'

class GameRequests(models.Model):
	from_user = models.ForeignKey(to=User, related_name='from_user_game_req', on_delete=models.SET_NULL, null=True)
	to_user = models.ForeignKey(to=User, related_name='to_user_game_req', on_delete=models.SET_NULL, null=True)
	created = models.DateTimeField(auto_now_add=True)
	exp = models.DateTimeField(auto_now_add=True)
	status = models.CharField(default="pending")

	def __str__(self) -> str:
		return f'ID: {self.id}\nFrom_User: {self.from_user}\nTo_User:   {self.to_user}\nCreated:   {self.created}\nExp:       {self.exp}\nStatus:    {self.status}'
