from django.shortcuts import render
from .tfa_utils import *
from django.http import JsonResponse
import json
from custom_decorators import accepted_methods, login_required
import os

@accepted_methods(["POST"])
def generateOTP(request):
	print("---------------------------------------")
	print(request.headers)
	print(request.body)
	print("---------------------------------------")
	otp_code = generate_otp_code()
	print(f"code: {otp_code}")
	print("---------------------------------------")
	message = {"message": "Code created with success.", "code": otp_code}
	return JsonResponse(message)

@accepted_methods(["POST"])
def validateOTP(request):

	if request.body:
		req_data = json.loads(request.body)
		otp_input_code = str(req_data['code']).strip()
		print(f"Input Code: {otp_input_code}")

		if otp_input_code:
				if is_valid_otp(otp_input_code):
					message = "Validated with Success"
				else:
					message = "Invalid Code"
		else:
			message = "Empty Input"
	else:
		message = "Empty request Body"

	print(message)
	response_msg = {"message": message}
	return JsonResponse(response_msg)

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

	if request.body:
		message = "Body with Content"
		
		body_unicode = request.body.decode('utf-8')
		body_data = json.loads(body_unicode)

		qr_code = body_data.get("qr_code")
		email = body_data.get("email")
		phone = body_data.get("phone")

		print("--------------------------------------")
		print(body_data)
		print("--------------------------------------")
		print("QR Code: " + str(qr_code))
		print("  Email: " + str(email))
		print("  Phone: " + str(phone))
		print("--------------------------------------")

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
