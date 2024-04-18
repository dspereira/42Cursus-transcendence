from custom_utils.models_utils import ModelManager
from .models import BlacklistOtp, OtpUserOptions
from user_auth.models import User

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

blacklist_otp_model = ModelManager(BlacklistOtp)
otp_user_opt_model = ModelManager(OtpUserOptions)
user_model = ModelManager(User)

def generate_otp_code():
	totp = pyotp.TOTP(secret_key)
	otp_value = totp.now()
	return otp_value

def is_valid_otp(otp: str):
	totp = pyotp.TOTP(secret_key)
	if otp:
		if not blacklist_otp_model.get(code=otp):
			blacklist_otp_model.create(code=otp)
			if totp.verify(otp):
				return True
	return False

# Apenas para usar em Testes
def get_all_otps_used_utils():
	src = ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n"
	otps = blacklist_otp_model.all()
	if blacklist_otp_model.count():
		for otp in otps:
			src += str(otp) + "\n"
	else:
		src += "Database is Empty\n"
	src += ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n"
	return src
