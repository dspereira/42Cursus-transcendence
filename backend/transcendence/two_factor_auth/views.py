from django.shortcuts import render
from .tfa_utils import *
from django.http import JsonResponse
import json
from custom_decorators import accepted_methods
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

@accepted_methods(["GET"])
def get_all_