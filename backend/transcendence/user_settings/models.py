from user_auth.models import User
from django.db import models

class UserSettings(models.Model):
	user = models.ForeignKey(to=User, db_index=True, on_delete=models.CASCADE)
	game_theme = models.IntegerField(default=0, null=False, blank=False)
	language = models.CharField(default="en", null=False, blank=False)

	def __str__(self) -> str:
		return f'User: {self.user} | Language: {self.language} | Game Theme: {self.game_theme}'

	class Meta:
		db_table = 'user_settings'
