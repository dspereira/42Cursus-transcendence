from django.db import models
from datetime import datetime, timedelta
from .models import UsedOneTimePasswords

import pyotp
import qrcode
import pyotp.utils

from custom_utils.models_utils import ModelManager

# Expiration time in seconds
OTP_EXP_TIME_SEC = 1 * 60

secret_key = pyotp.random_base32()
provisioning_uri = pyotp.utils.build_uri(
	secret=secret_key,
	issuer="42T",
	name="diogo",
)

qrcode.make(provisioning_uri).save("qr_auth.png")

totp = pyotp.TOTP(secret_key)

used_otp_model = ModelManager(UsedOneTimePasswords)

def generate_otp_code():
	totp = pyotp.TOTP(secret_key)
	otp_value = totp.now()
	return otp_value

def is_valid_otp(otp: str):
	totp = pyotp.TOTP(secret_key)
	if otp:
		if not used_otp_model.get(code=otp):
			if totp.verify(otp):
				used_otp_model.create(code=otp)
				return True
	return False

def print_all_otps_used():
	print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
	otps = used_otp_model.all()
	if used_otp_model.count():
		for otp in otps:
			print(otp)
	else:
		print("Database is Empty")
	print(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
