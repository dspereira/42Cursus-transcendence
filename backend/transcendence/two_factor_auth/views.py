from custom_decorators import accepted_methods, login_required
from custom_utils.models_utils import ModelManager
from django.http import JsonResponse
from .models import OtpUserOptions
import json
import os

from .two_factor import getUser
from .two_factor import generate_qr_code_img_base64
from .two_factor import send_smsto_user
from .two_factor import send_email_to_user
from .two_factor import is_valid_otp
from .two_factor import is_valid_otp_qr_code
from .two_factor import update_user_2fa_options
from .two_factor import exist_qr_code
from .two_factor import exist_email
from .two_factor import exist_phone_number

# Apenas para Testes
from .two_factor import is_configuration_in_db
from .two_factor import create_user_options
from .two_factor import get_user_otp_options

otp_user_settings_model = ModelManager(OtpUserOptions)

@accepted_methods(["GET"])
def configured_2fa(request):
	if request:
		if request.access_data:
			user = getUser(request.access_data.sub)
			if not user:
				return JsonResponse({"message": "Error: Invalid Users!"}, status=409)
			otp_user_settings = otp_user_settings_model.get(user=user)
			if not otp_user_settings:
				return JsonResponse({"message": "Error: User has no OTP setup!"}, status=409)
			configured_methods = {"qr_code": False, "email": False, "phone": False}
			if exist_qr_code(user):
				configured_methods['qr_code'] = True
			if exist_email(user):
				configured_methods['email'] = True
			if exist_phone_number(user):
				configured_methods['phone'] = True
			return JsonResponse({"message": "OTP option sended with success!", "configured_methods": configured_methods}, status=200)
	return JsonResponse({"message": "Error: Invalid Request!"}, status=400)

@accepted_methods(["GET"])
def generate_qr_code(request):

	message = "Error generating QR Code"
	qr_code = None

	if request.access_data:
		user = getUser(request.access_data.sub)

	qr_code = generate_qr_code_img_base64(user)
	if qr_code:
		message = "QR Code generated with Success"

	return JsonResponse({"message": message, "qr_code": qr_code})

@accepted_methods(["GET"])
def generate_user_phone_code(request):

	message = None

	if request.access_data:
		user = getUser(request.access_data.sub)

	message = send_smsto_user(user)
	if not message:
		message = "Error sending SMS"

	return JsonResponse({"message": message})

@accepted_methods(["GET"])
def generate_user_email_code(request):

	message = "Email sended with Success!"

	if request.access_data:
		user = getUser(request.access_data.sub)

	status = send_email_to_user(user)
	if not status:
		message = "Error sending Email"

	return JsonResponse({"message": message})

@accepted_methods(["POST"])
def validateOTP(request):

	message = "Invalid Code"
	is_valid = False
	if request.access_data:
		user = getUser(request.access_data.sub)
	if request.body:
		body_unicode = request.body.decode('utf-8')
		req_data = json.loads(body_unicode)
		otp_input_code = str(req_data['code']).strip()
		if otp_input_code:
				if is_valid_otp(otp_input_code, user):
					message = "Validated with Success"
					is_valid = True
				else:
					message = "Invalid Code"
		else:
			message = "Empty Input"
	else:
		message = "Empty request Body"

	return JsonResponse({"message": message, "valid": is_valid})

@accepted_methods(["POST"])
def validateOTP_QR_Code(request):

	message = "Invalid Code"
	is_valid = False

	if request.access_data:
		user = getUser(request.access_data.sub)

	if request.body:
		body_unicode = request.body.decode('utf-8')
		req_data = json.loads(body_unicode)
		otp_input_code = str(req_data['code']).strip()
		if otp_input_code:
				if is_valid_otp_qr_code(otp_input_code, user):
					message = "Validated with Success"
					is_valid = True
				else:
					message = "Invalid Code"
		else:
			message = "Empty Input"
	else:
		message = "Empty request Body"

	return JsonResponse({"message": message, "valid": is_valid})

@accepted_methods(["GET"])
def is_already_configured(request):

	if request.access_data:
		user = getUser(request.access_data.sub)

	if is_configuration_in_db(user):
		return JsonResponse({"message": "Already Configured", "already_configured": True})
	else:
		return JsonResponse({"message": "Need to be Configured", "already_configured": False})

@accepted_methods(["POST"]) # Remover
def configuration(request):

	message = "Empty Body Content"
	valid_input = False

	if request.access_data:
		user = getUser(request.access_data.sub)

	if is_configuration_in_db(user):
		message = "Already Configured"
		valid_input = False
	else:
		if request.body:
			message = "Body with Content"
			body_unicode = request.body.decode('utf-8')
			body_data = json.loads(body_unicode)
			qr_code = body_data.get("qr_code")
			email = body_data.get("email")
			phone = body_data.get("phone")
			if qr_code or email or phone:
				create_user_options(user=user, qr_code=qr_code, email=email, phone=phone)
				if is_configuration_in_db(user):
					message = "2FA Configured with SUCESS !"
					valid_input = True
			else:
				message = "Need atleast one option of 2FA"
				valid_input = False

	return JsonResponse({"message": message, "valid_input": valid_input})

@accepted_methods(["GET"])
def get_current_settings(request):

	message = None
	user_settings = None

	qr_code = False
	email = False
	country_code = None
	phone = None

	if request.access_data:
		user = getUser(request.access_data.sub)

	if not is_configuration_in_db(user):
		message = "Need Configuration"
	else:
		user_configurations = get_user_otp_options(user)
		if user_configurations.qr_code:
			qr_code = True
		if user_configurations.email:
			email = True
		if user_configurations.phone_number:
			phone_number_parts = user_configurations.phone_number.split()
			country_code = phone_number_parts[0]
			phone = phone_number_parts[1]
		user_settings = {
			"qr_code": qr_code,
			"email": email,
			"country_code": country_code,
			"phone": phone
		}
		message = "All configurations sended!"

	return JsonResponse({"message": message, "user_settings": user_settings})

@accepted_methods(["POST"]) # Deve ser UPDATE
def update_configurations(request):

	message = None
	status = None

	if request.access_data:
		user = getUser(request.access_data.sub)
	
	if request.body:
		body_unicode = request.body.decode('utf-8')
		body_data = json.loads(body_unicode)
		qr_code_status = body_data['qr_code']
		email_status = body_data['email']
		phone_status = body_data['phone_status']
		phone_value = body_data['phone_value']
		if not qr_code_status and not email_status and not phone_status:
			message = "Need atleast one option of 2FA"
			status = "KO"
		else:
			update_user_2fa_options(user, qr_code_status, email_status, phone_status, phone_value)
			message = "Updated with Success"
			status = "OK"

	return JsonResponse({"message": message, "status": status})













"""
---------------------------------------------------------------------
---------------- VERIFICAR SE ESTAS ROTAS SÃO USADAS ----------------
---------------------------------------------------------------------
"""

@accepted_methods(["GET"])
def is_qr_code_configured(request):

	message = "QR Code is not Configured"
	config_status = False

	if request.access_data:
		user = getUser(request.access_data.sub)

	if exist_qr_code(user):
		message = "QR Code is Configured"
		config_status = True

	return JsonResponse({"message": message, "config_status": config_status})

@accepted_methods(["GET"])
def is_email_configured(request):

	message = "Email is not Configured"
	config_status = False

	if request.access_data:
		user = getUser(request.access_data.sub)

	if exist_email(user):
		message = "Email is Configured"
		config_status = True

	return JsonResponse({"message": message, "config_status": config_status})

@accepted_methods(["GET"])
def is_phone_configured(request):

	message = "Phone Number is not Configured"
	config_status = False

	if request.access_data:
		user = getUser(request.access_data.sub)

	if exist_phone_number(user):
		message = "Phone Number is Configured"
		config_status = True

	return JsonResponse({"message": message, "config_status": config_status})
