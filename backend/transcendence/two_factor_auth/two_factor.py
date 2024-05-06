from django.http import JsonResponse
from .tfa_utils import *
import json
import os

def setup_default_tfa_configs(user):
	default_user_options(user)

def initiate_two_factor_authentication(user):
	if exist_qr_code(user=user):
		return "qr_code"
	elif exist_email(user=user):
		send_email_to_user(user=user)
		return "email"
	else:
		send_smsto_user(user=user)
		return "phone"
