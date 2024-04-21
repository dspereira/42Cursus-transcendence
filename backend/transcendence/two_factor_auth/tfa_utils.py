from custom_utils.models_utils import ModelManager
from .models import BlacklistOtp, OtpUserOptions
from user_auth.models import User

from .cryptography_utils import Cryptographer

import pyotp
import qrcode
import pyotp.utils
import base64
import io

# Expiration time in seconds
OTP_EXP_TIME_SEC = 1 * 60

""" provisioning_uri = pyotp.utils.build_uri(
	secret=secret_key,
	issuer="42T",
	name="diogo",
) """

# qrcode.make(provisioning_uri).save("qr_auth.png")

# totp = pyotp.TOTP(secret_key)

blacklist_otp_model = ModelManager(BlacklistOtp)
otp_user_opt_model = ModelManager(OtpUserOptions)
user_model = ModelManager(User)

def generate_otp_code(user):
	otp_value = None
	secret_key = get_user_secret_key(user)
	if secret_key:
		totp = pyotp.TOTP(secret_key)
		otp_value = totp.now()
	return otp_value

def generate_qr_code_img_base64(user):
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
	secret_key = get_user_secret_key(user)
	print("Secret: key: " + secret_key)
	if secret_key:
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

def getUser(user_id):
	return user_model.get(id=user_id)

def is_configuration_in_db(user):
	if otp_user_opt_model.get(user_id=user):
		return True
	return False

def generate_encrypted_user_secret_key():
	secret_key = pyotp.random_base32()
	encrypted_secret_key = Cryptographer().encrypt_message(message=secret_key)
	return encrypted_secret_key

def get_user_secret_key(user):
	otp_user = otp_user_opt_model.get(user_id=user)
	if otp_user:
		encrypted_secret_key = otp_user.secret_key
		decrypted_secret_jey = Cryptographer().decrypt_message(encrypted_message=encrypted_secret_key)
		return decrypted_secret_jey
	return None

def create_user_options(user, qr_code, email, phone):
	secret_key = generate_encrypted_user_secret_key()

	user_email = None
	if email:
		user_email = user.email

	user_phone_number = None
	if phone:
		user_phone_number = phone

	otp_user_opt_model.create(
		user_id=user,
		secret_key=secret_key,
		qr_code=qr_code,
		email=user_email,
		phone_number=user_phone_number
	)

def get_user_otp_options(user):
	return otp_user_opt_model.get(user_id=user)

def update_user_2fa_options(user, qr_code_status, email_status, phone_status, phone_value):
	otp_user_opt = otp_user_opt_model.get(user_id=user)
	if otp_user_opt:

		if qr_code_status != otp_user_opt.qr_code:
			otp_user_opt.qr_code = qr_code_status

		if not otp_user_opt.email and email_status:
			otp_user_opt.email = user.email
		elif otp_user_opt.email and not email_status:
			otp_user_opt.email = None

		if not otp_user_opt.phone_number and phone_status:
			otp_user_opt.phone_number = phone_value
		elif otp_user_opt.phone_number and not phone_status:
			otp_user_opt.phone_number = None

		otp_user_opt.save()

def exist_qr_code(user):
	otp_user_opt = otp_user_opt_model.get(user_id=user)
	if otp_user_opt:
		if otp_user_opt.qr_code:
			return True
	return False

def exist_email(user):
	otp_user_opt = otp_user_opt_model.get(user_id=user)
	if otp_user_opt:
		if otp_user_opt.email:
			return True
	return False

def exist_phone_number(user):
	otp_user_opt = otp_user_opt_model.get(user_id=user)
	if otp_user_opt:
		if otp_user_opt.phone_number:
			return True
	return False
