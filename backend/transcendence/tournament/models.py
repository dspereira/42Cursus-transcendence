from django.db import models
from user_auth.models import User
from .consts import TOURNAMENT_STATUS_CREATED

class Tournament(models.Model):
	name = models.CharField(null=False, max_length=50)
	created = models.DateTimeField(auto_now_add=True)
	nbr_players = models.IntegerField(default=0)
	nbr_max_players = models.IntegerField(default=4)
	status = models.CharField(default=TOURNAMENT_STATUS_CREATED)

	def __str__(self) -> str:
		return f'ID: {self.id}\nName: {self.name}\nNbr Players:   {self.nbr_players}\nNbr Max Players:   {self.nbr_max_players}\nCreated:   {self.created}'

class TournamentRequests(models.Model):
	from_user = models.ForeignKey(to=User, related_name='from_user_tournament_req', on_delete=models.SET_NULL, null=True)
	to_user = models.ForeignKey(to=User, related_name='to_user_tournament_req', on_delete=models.SET_NULL, null=True)
	created = models.DateTimeField(auto_now_add=True)
	exp = models.DateTimeField(auto_now_add=True)
	tournament = models.ForeignKey(to=Tournament, related_name='tournament_request_id', on_delete=models.SET_NULL, null=True)
	status = models.CharField(default="pending")

	def __str__(self) -> str:
		return f'ID: {self.id}\nFrom_User: {self.from_user}\nTo_User:   {self.to_user}\nCreated:   {self.created}\nExp:       {self.exp}\nStatus:    {self.status}'

class TournamentPlayers(models.Model):
	user = models.ForeignKey(to=User, related_name='tournament_player', on_delete=models.SET_NULL, null=True)
	tournament = models.ForeignKey(to=Tournament, related_name='tournament_player_id', on_delete=models.SET_NULL, null=True)

	def __str__(self) -> str:
		return f'ID: {self.id}\nUser: {self.user.username}\nTornament:   {self.tournament}'
