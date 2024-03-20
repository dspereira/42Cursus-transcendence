from django.db import models

# Create your models here.

class Player(models.Model):
    nick = models.CharField()
    first = models.CharField()
    last = models.CharField()

    def __str__(self):
        return f"{self.id}: {self.nick}"

class Game(models.Model):
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="user1")
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="user2")
    score1 = models.IntegerField()
    score2 = models.IntegerField()

    def __str__(self):
        return f"Game {self.id} - {self.player1} {self.score1} : {self.score2} {self.player2}"