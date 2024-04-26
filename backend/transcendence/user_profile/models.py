from django.db import models
from user_auth.models import User

class FriendLinks(models.Model):
    user1 = models.ForeignKey(to=User, related_name='first', db_index=True, on_delete=models.CASCADE)
    user2 = models.ForeignKey(to=User, related_name='second', on_delete=models.CASCADE)
    accepted = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f'User1: {self.user1} | User2: {self.user2}'

class UserProfileInfo(models.Model):
    user_id = models.ForeignKey(to=User, db_index=True, on_delete=models.CASCADE)
    bio = models.CharField(max_length=255)
    # profile_pic = models.

    def __str__(self) -> str:
        return f'User: {self.user_id} | Bio: {self.bio}'