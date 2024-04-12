from django.db import models

class OneTimePasswords(models.Model):
	code = models.CharField(max_length=10, db_index=True)
	expiration_date = models.IntegerField()

	def __str__(self):
		return f'{self.code} | {self.expiration_date}'
