from django.db import models

class BlacklistedToken(models.Model):
    jti = models.CharField(max_length=255, unique=True, db_index=True, null=False)
    exp = models.IntegerField (null=False)

    def __str__(self):
        return f"ID {self.id}: Token {self.jti} expires at {self.exp}"

    class Meta:
        db_table = 'blacklisted_tokens'

