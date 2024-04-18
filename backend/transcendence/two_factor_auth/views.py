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
		user = user_model.get(id=request.access_data.sub)

	otp_user_options = otp_user_opt_model.get(user=user)
	if otp_user_options:
		return JsonResponse({"message": "Already Configured", "already_configured": True})
	else:
		return JsonResponse({"message": "Need to be Configured", "already_configured": False})
