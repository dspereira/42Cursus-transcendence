from django.shortcuts import render
from .tfa_utils import *
from django.http import JsonResponse
import json
from custom_decorators import accepted_methods, login_required
import os

@accepted_methods(["POST"])
def generateOTP(request):
	otp_code = generate_otp_code()
	message = {"message": "Code created with success.", "code": otp_code}
	return JsonResponse(message)

@accepted_methods(["GET"])
@login_required
def generate_qr_code(request):

	message = "Error generating QR Code"
	qr_code = None

	if request.access_data:
		user = getUser(request.access_data.sub)

	qr_code = generate_qr_code_img_base64(user)
	if qr_code:
		message = "QR Code generated with Success"

	return JsonResponse({"message": message, "qr_code": qr_code})

@accepted_methods(["POST"])
@login_required
def validateOTP(request):

	message = "Invalid Code"
	is_valid = False

	if request.access_data:
		user = getUser(request.access_data.sub)

	if request.body:
		body_unicode = request.body.decode('utf-8')
		req_data = json.loads(body_unicode)

		otp_input_code = str(req_data['code']).strip()
		print(f"Input Code: {otp_input_code}")
	
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

# Apenas para Testes
@accepted_methods(["GET"])
def get_all_used_otps(request):
	message = get_all_otps_used_utils()
	print(message)
	response_msg = {"message": message}
	return JsonResponse(response_msg)

@accepted_methods(["GET"])
@login_required
def is_already_configured(request):

	if request.access_data:
		user = getUser(request.access_data.sub)

	if is_configuration_in_db(user):
		return JsonResponse({"message": "Already Configured", "already_configured": True})
	else:
		return JsonResponse({"message": "Need to be Configured", "already_configured": False})

@accepted_methods(["POST"])
@login_required
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
				print("Passei por Aqui!")
				if is_configuration_in_db(user):
					message = "2FA Configured with SUCESS !"
					valid_input = True
			else:
				message = "Need atleast one option of 2FA"
				valid_input = False

	return JsonResponse({"message": message, "valid_input": valid_input})

@accepted_methods(["GET"])
@login_required
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

@accepted_methods(["POST"])
@login_required
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

@accepted_methods(["GET"])
@login_required
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
@login_required
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
@login_required
def is_phone_configured(request):

	message = "Phone Number is not Configured"
	config_status = False

	if request.access_data:
		user = getUser(request.access_data.sub)

	if exist_phone_number(user):
		message = "Phone Number is Configured"
		config_status = True

	return JsonResponse({"message": message, "config_status": config_status})

