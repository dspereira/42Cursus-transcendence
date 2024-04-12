from django.db import models
from datetime import datetime, timedelta
from two_factor_auth.models import OneTimePasswords
from custom_utils.models_utils import ModelManager
import pyotp

# Expiration time in seconds
OTP_EXP_TIME_SEC = 1 * 60

otp_model = ModelManager(OneTimePasswords)

def generate_otp_code():
	secret_key = pyotp.random_base32()
	totp = pyotp.TOTP(secret_key)
	otp_value = totp.now()
	return otp_value

def generate_otp_expiration_timestamp():
	expiration_date = datetime.now() + timedelta(seconds=OTP_EXP_TIME_SEC)
	expiration_timestamp = int(expiration_date.timestamp())
	return expiration_timestamp

def exist_otp(otp_value: int):
	otp = otp_model.get(code=otp_value)
	if otp:
		return otp
	return None

def is_valid_otp(otp: models.Model):
	if otp:
		otp_expiration_ts = otp.expiration_date
		current_timestamp = int(datetime.now().timestamp())
		if current_timestamp <= otp_expiration_ts:
			return True
	return False

def add_otp_to_database(otp_code, otp_exp_timestamp):
	return otp_model.create(code=otp_code, expiration_date=otp_exp_timestamp)

def delete_otp(otp: models.Model):
	if otp:
		otp.delete()

# APENAS PARA TESTE
def delete_invalid_otps():
	all_otps = otp_model.all()
	for otp in all_otps:
		otp_expiration_ts = int(otp.expiration_date)
		current_timestamp = int(datetime.now().timestamp())
		if current_timestamp > otp_expiration_ts:
			otp.delete()

# APENAS PARA TESTE
def show_all_opts():
	all_otps = otp_model.all()
	if otp_model.count():
		for otp in all_otps:
			print(otp)
	else:
		print("OTP database empty")

# APENAS PARA TESTE
def show_valid_opts():
	all_otps = otp_model.all()
	result = ""
	for otp in all_otps:
		otp_expiration_ts = int(otp.expiration_date)
		current_timestamp = int(datetime.now().timestamp())
		if current_timestamp <= otp_expiration_ts:
			result += str(otp) + "\n"
	if result:
		print(result)
	else:
		print("There is no valid OTPS")

# APENAS PARA TESTE
def get_specific_otp_obj(code: int):
	return otp_model.get(code=code)
