from django.db import models
from datetime import datetime, timedelta

import pyotp
import qrcode
import pyotp.utils

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

def generate_otp_code():
	totp = pyotp.TOTP(secret_key)
	otp_value = totp.now()
	return otp_value

def is_valid_otp(otp: str):
	totp = pyotp.TOTP(secret_key)
	if otp:
		if totp.verify(otp):
			return True
	return False
