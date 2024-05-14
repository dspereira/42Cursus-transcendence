from django.db import models
from user_auth.models import User
from game_engine.models import Match
# from .models import	Tournament

class	PlayerList(models.Model):
	n_players = models.IntegerField(default=1)
	player1 = models.ForeignKey(to=User, related_name='player1', on_delete=models.SET_NULL, null=True)
	player2 = models.ForeignKey(to=User, related_name='player2', on_delete=models.SET_NULL, null=True)
	player3 = models.ForeignKey(to=User, related_name='player3', on_delete=models.SET_NULL, null=True)
	player4 = models.ForeignKey(to=User, related_name='player4', on_delete=models.SET_NULL, null=True)

class	MatchList(models.Model):
	n_matches = models.IntegerField(default=0)
	semi_final1 = models.ForeignKey(to=Match, related_name='semi_final1', on_delete=models.SET_NULL, null=True)
	semi_final2 = models.ForeignKey(to=Match, related_name='semi_final2', on_delete=models.SET_NULL, null=True)
	loser_game = models.ForeignKey(to=Match, related_name='loser_game', on_delete=models.SET_NULL, null=True)
	final = models.ForeignKey(to=Match, related_name='final', on_delete=models.SET_NULL, null=True)


class Tournament(models.Model):
	player_list = models.ForeignKey(to=PlayerList, related_name="player_list", db_index=True, on_delete=models.CASCADE)
	match_list = models.ForeignKey(to=MatchList, related_name='match_list', db_index=True, on_delete=models.SET_NULL, null=True)
	