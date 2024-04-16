from django.db import models

class UsedOneTimePasswords(models.Model):
	code = models.IntegerField(unique=True, db_index=True)

	def __str__(self) -> str:
		return f"Code: {self.code}"
