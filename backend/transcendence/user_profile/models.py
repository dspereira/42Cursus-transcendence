from django.db import models
from user_auth.models import User

class UserProfileInfo(models.Model):
	user_id = models.ForeignKey(to=User, db_index=True, on_delete=models.CASCADE)
	bio = models.CharField(max_length=255, default="Hi, let's play a game!")
	default_image_seed = models.CharField(max_length=35, default="") 
	profile_image = models.BinaryField(null=True, blank=True)
	total_games = models.IntegerField(default=0)
	victories = models.IntegerField(default=0)
	defeats = models.IntegerField(default=0)
	win_rate = models.IntegerField(default=0)
	tournaments_won = models.IntegerField(default=0)

	def __str__(self) -> str:
		return f'User: {self.user_id} | Bio: {self.bio}'
	
	class Meta:
		db_table = 'user_profile_info'