from django.http import HttpResponse
from django.contrib.auth import authenticate
#from django.contrib.auth.models import User
from django.http import JsonResponse
from user_management.models import BlacklistedToken, UserAccount

#django.contrib.auth.login

import json
#import jwt
#import uuid
#from datetime import datetime, timedelta

from django.views.decorators.http import require_http_methods
from custom_decorators import login_required

from datetime import datetime, timedelta


#from custom_utils.jwt_utils.generate_token import generate_access_token, generate_refresh_token
from custom_utils.jwt_utils import TokenGenerator

from django.contrib.auth import get_user_model

from .auth_utils import login, logout, refresh_token, update_blacklist

from user_management.models import UserAccount


# IMPORTANT: The refresh token should be sent to authentication routes, especially logout and refresh token routes, to be added to the blacklist.
# Choose a path that covers the authentication routes.
# Example: /api/auth/login, /api/auth/logout, /api/auth/refresh, /api/auth/register -> Cookie refresh path="/api/auth"


@require_http_methods(["POST"])
def token_obtain_view(request):
	if request.body:
		req_data = json.loads(request.body)
		user = authenticate(request, username=req_data["username"], password=req_data["password"])
		if user:
			response = JsonResponse({"message": "success"})
			response = login(response, user)

			print(response)

			return response
	#enviar codigo 401 UNAUTHORIZED 
	return JsonResponse({"message": "error"})

@require_http_methods(["POST"])
def token_refresh_view(request):

	#deve enviar tokens para a blackList

	if request.refresh_data:
		response = JsonResponse({"message": "success"})
		refresh_token(response, request.refresh_data.sub)
		update_blacklist(request.access_data, request.refresh_data)
	#enviar codigo 401 UNAUTHORIZED 
	return JsonResponse({"message": "error"})

@require_http_methods(["POST"])
def api_signin(request):
	if request.body:
		req_data = json.loads(request.body)
		if req_data:
			email = req_data['email']
			username = req_data['username']
			password = req_data['password']
		if (not email or not username or not password):
			return JsonResponse({"message": "error"})
		if UserAccount.objects.filter(username=username).exists() or UserAccount.objects.filter(email=email).exists():
			return JsonResponse({"message": "error"})
		UserAccount.objects.create_user(username=username, email=email, password=password)
		user = authenticate(request, username=username, password=password)
		if not user:
			return JsonResponse({"message": "error"})
	return JsonResponse({"message": "success"})


@require_http_methods(["POST"])
def api_logout(request):

	# has to send tokens to blacklist

	if request.access_data:
		response = JsonResponse({"message": "success"})
		response = logout(response)
		update_blacklist(request.access_data, request.refresh_data)
		return response

	# enviar 401 UNAUTHORIZED
	return JsonResponse({"message": "error"})


#@login_required
def api_info(request):

	if request.access_data:
		user = UserAccount.objects.get(id=request.access_data.sub)
	else:
		user = None

	if user:
		username = user.username
	else:
		username = "Not Loged"		
	res_data = {
		"user": username
	}
	return JsonResponse(res_data)


