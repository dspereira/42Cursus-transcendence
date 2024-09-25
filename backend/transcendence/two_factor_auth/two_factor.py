from custom_utils.models_utils import ModelManager
from .models import OtpCodes, OtpUserOptions
from user_auth.models import User
from dotenv import load_dotenv
from .cryptography_utils import Cryptographer
import pyotp
import qrcode
import pyotp.utils
import base64
import io
import os
import re
import math
from datetime import datetime, timedelta
from twilio.rest import Client
from custom_utils.email_utils import EmailSender
from transcendence import settings

from .TFACodesSendedManager import TFACodesSendedManager

load_dotenv()

otp_codes_model = ModelManager(OtpCodes)
otp_user_opt_model = ModelManager(OtpUserOptions)
user_model = ModelManager(User)

AVAILABLE_OTP_METHODS = ['email', 'phone', 'qr_code']

OTP_STATUS_USED = "used"
OTP_STATUS_AVAILABLE = "available"
OTP_STATUS_INVALID = "invalid"

OTP_EXP_TIME_MIN = 5
OTP_EXP_TIME_SEC = OTP_EXP_TIME_MIN * 60

def setup_two_factor_auth(user):
	secret_key = generate_encrypted_user_secret_key()
	default_user_options = otp_user_opt_model.create(
		user=user,
		secret_key=secret_key,
		qr_code=False,
		email=user.email,
		phone_number=None,
		nbr_codes_sended=0,
		last_code_sended_timestamp=0,
		wait_time_timestamp=0
	)
	return default_user_options

def initiate_two_factor_authentication(user):
	if exist_qr_code(user=user):
		return "qr_code"
	elif exist_email(user=user):
		return "email"
	else:
		return "phone"

def invalidate_all_valid_user_otp(user):
	if user:
		valid_otps = otp_codes_model.filter(created_by=user, status=OTP_STATUS_AVAILABLE)
		if valid_otps:
			for otp in valid_otps:
				otp.status = OTP_STATUS_INVALID
				otp.save()

def generate_otp_code(user):
	otp_value = None
	if user:
		invalidate_all_valid_user_otp(user)
		secret_key = get_user_secret_key(user)
		if secret_key:
			totp = pyotp.TOTP(secret_key, interval=OTP_EXP_TIME_SEC)
			otp_value = totp.now()
			code = otp_codes_model.create(created_by=user, code=otp_value, status=OTP_STATUS_AVAILABLE)
			if not code:
				return None
			otp_options = otp_user_opt_model.get(user=user)
			if otp_options:
				TFACodesSendedManager.new_code_sended(otp_options, code)
	return otp_value

def reset_wait_time_codes(user):
	if user:
		otp_options = otp_user_opt_model.get(user=user)
		if otp_options:
			TFACodesSendedManager.reset(otp_options)

def generate_qr_code_img_base64(user):
	if user:
		secret_key = get_user_secret_key(user)
		if secret_key:
			provisioning_uri = pyotp.utils.build_uri(
				secret=secret_key,
				issuer="42T",
				name=user.username,
			)
			qr_img = qrcode.make(provisioning_uri)
			img_buffer = io.BytesIO()
			qr_img.save(img_buffer)
			img_buffer.seek(0)
			img_base64 = base64.b64encode(img_buffer.read()).decode("utf-8")
			return img_base64
	return None

def is_valid_otp(otp: str, user):
	if user:
		code = otp_codes_model.get(created_by=user, code=otp, status=OTP_STATUS_AVAILABLE)
		if code:
			secret_key = get_user_secret_key(user)
			if secret_key:
				totp = pyotp.TOTP(secret_key, interval=OTP_EXP_TIME_SEC)
				if otp:
					if totp.verify(otp):
						code.status = OTP_STATUS_USED
						code.save()
						return True
	return False

def is_valid_otp_qr_code(otp: str, user):
	secret_key = get_user_secret_key(user)
	if secret_key:
		totp = pyotp.TOTP(secret_key)
		if otp:
			if totp.verify(otp):
				if not otp_codes_model.create(created_by=user, status=OTP_STATUS_USED, code=otp):
					return False
				return True
	return False

def generate_encrypted_user_secret_key():
	secret_key = pyotp.random_base32()
	encrypted_secret_key = Cryptographer().encrypt_message(message=secret_key)
	return encrypted_secret_key

def get_user_secret_key(user):
	otp_user = otp_user_opt_model.get(user=user)
	if otp_user:
		encrypted_secret_key = otp_user.secret_key
		decrypted_secret_jey = Cryptographer().decrypt_message(encrypted_message=encrypted_secret_key)
		return decrypted_secret_jey
	return None

def exist_qr_code(user):
	otp_user_opt = otp_user_opt_model.get(user=user)
	if otp_user_opt:
		if otp_user_opt.qr_code:
			return True
	return False

def exist_email(user):
	otp_user_opt = otp_user_opt_model.get(user=user)
	if otp_user_opt:
		if otp_user_opt.email:
			return True
	return False

def exist_phone_number(user):
	otp_user_opt = otp_user_opt_model.get(user=user)
	if otp_user_opt:
		if otp_user_opt.phone_number:
			return True
	return False

def send_smsto_user(user):
	account_sid = settings.TWILIO_ACCOUNT_SID
	auth_token = settings.TWILIO_AUTH_TOKEN
	phone_number = settings.TWILIO_PHONE_NUMBER
	otp_code = generate_otp_code(user)
	if not otp_code:
		return None
	message_body = f"Authnetication Code: " + otp_code
	otp_user_opt = otp_user_opt_model.get(user=user)
	user_phone_number = re.sub(r'\s+', '', otp_user_opt.phone_number)
	client = Client(account_sid, auth_token)
	message = client.messages.create(
		body=message_body,
		from_=phone_number,
		to=user_phone_number
	)
	return otp_code

def send_email_to_user(user):
	otp_user_opt = otp_user_opt_model.get(user=user)
	otp_code = generate_otp_code(user)
	if otp_code and EmailSender().send_verification_code(code=otp_code, receiver_email=otp_user_opt.email):
		return True
	return False

def is_valid_input_code(input_code):
	if input_code:
		code = str(input_code)
		if len(code) == 6 and code.isdigit():
			return True
	return False

def is_valid_otp_method(otp_method):
	if otp_method:
		if otp_method in AVAILABLE_OTP_METHODS:
			return True
	return False

def get_new_code_wait_time(user):
	wait_time_str = None
	wait_time = None
	if user:
		otp_options = otp_user_opt_model.get(user=user)
		if otp_options:
			wait_time = TFACodesSendedManager.get_wait_time(otp_options)
		if wait_time:
			time_now = datetime.now().timestamp()
			if wait_time > time_now:
				new_wait_time = (wait_time - time_now) / 60
				if new_wait_time <= 0.3:
					wait_time_str = "30 seconds left"
				else:
					wait_time_str = f"{math.floor(new_wait_time) + 1} minute(s)"
	return wait_time_str

def is_valid_phone_number(phone_number: str):
	if phone_number:
		phone_number_pattern = r'^\+\d{1,3} \d{4,14}$'
		if re.match(phone_number_pattern, phone_number):
			return True
		return False
	else:
		return True
