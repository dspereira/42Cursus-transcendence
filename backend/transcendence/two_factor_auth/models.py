from django.db import models
from user_auth.models import User

class BlacklistOtp(models.Model):
	code = models.IntegerField(unique=True, db_index=True)

	def __str__(self) -> str:
		return f"Code: {self.code}"

class OtpUserOptions(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
	secret_key = models.CharField()
	qr_code = models.BooleanField(default=False)
	email = models.CharField(unique=True, null=True)
	phone_number = models.CharField(max_length=20, unique=True, null=True, default=None)

	class Meta:
		db_table = 'two_factor_user_config'
