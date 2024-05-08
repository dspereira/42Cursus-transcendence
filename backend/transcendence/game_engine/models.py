from django.db import models
from user_auth.models import User
from django.dispatch import receiver
from django.db.models.signals import pre_delete

class Match(models.Model):
	
	user1 = models.ForeignKey(to=User, related_name='first', on_delete=models.SET_NULL, null=True)
	user2 = models.ForeignKey(to=User, related_name='second', on_delete=models.SET_NULL, null=True)
	user1_score = models.IntegerField(default=0) # updated when game ends for the ending score
	user2_score = models.IntegerField(default=0)
	winner = models.ForeignKey(to=User, related_name='winner', on_delete=models.SET_NULL, null=True)
	
	def delete_if_both_users_deleted(self):
		if self.user1_id is None and self.user2_id is None:
			self.delete()

	def __str__(self) -> str:
		return f'User1: {self.user1} | User2: {self.user2} | Status: {self.game_status} | Winner: {self.winner}'

@receiver(pre_delete, sender=User)
def delete_matches_if_both_users_deleted(sender, instance, **kwargs):
	# Find matches where the instance is the user1 or user2
	matches_to_delete = Match.objects.filter(models.Q(user1=instance) | models.Q(user2=instance))
	# Delete the matches where both users are already deleted
	for match in matches_to_delete:
		match.delete_if_both_users_deleted()


# id player 1
# id player 2
# score player 1
# score player 2
# game status (paused, ongoing)
# winner


# Create your models here.

"""
	definir como e q quero fazer as tabelas
	como e que guardo as tabelas e como e que guardo os dados do jogo e quem ganhou/contra quem na DB
"""