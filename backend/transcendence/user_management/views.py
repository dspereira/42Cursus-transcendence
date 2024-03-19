from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from user_management.models import BlacklistedToken, UserAccount


import json
import jwt
import uuid
from datetime import datetime, timedelta

# Just for testing purposes, the key must be 256 bit and it has to be in a .env file.
jwt_secret_key = "your-256-bit-secret"

ACCESS_TOKEN = "access"
REFRESH_TOKEN = "refresh"

@require_http_methods(["POST"])
def token_obtain_view(request):
	if request.body:
		req_data = json.loads(request.body)
		user = authenticate(request, username=req_data["username"], password=req_data["password"])
		if user:
			access_token = generate_token(user_id=user.id, name=user.get_username(), token_type=ACCESS_TOKEN)
			refresh_token = generate_token(user_id=user.id, name=user.get_username(), token_type=REFRESH_TOKEN)
			print(access_token)
			print(refresh_token)
			response = JsonResponse({"message": "success"})
			cookie_access_exp = datetime.utcnow() + timedelta(minutes=15)
			cookie_refresh_exp = datetime.utcnow() + timedelta(days=1)
			response.set_cookie(key="access", value=access_token, httponly=True, expires=cookie_access_exp, samesite="Lax")
			response.set_cookie(key="refresh", value=refresh_token, httponly=True, expires=cookie_refresh_exp, samesite="Lax", path="/user/api/token/refresh")
			return response
	return JsonResponse({"message": "error"})

@require_http_methods(["POST"])
def token_refresh_view(request):

	black_listed = BlacklistedToken(jti = request.token_data["jti"], exp = request.token_data["exp"])
	black_listed.save()

	token = BlacklistedToken.objects.filter(jti="aca3393a-3828-4efe-88da-8e2d2876f58c")
	print(token)

	user_id = request.token_data["sub"]
	name = request.token_data["name"]
	access_token = generate_token(user_id, name, token_type=ACCESS_TOKEN)
	refresh_token = generate_token(user_id, name, token_type=REFRESH_TOKEN)
	response = JsonResponse({"message": "success"})
	cookie_access_exp = datetime.utcnow() + timedelta(minutes=15)
	cookie_refresh_exp = datetime.utcnow() + timedelta(days=1)
	response.set_cookie(key="access", value=access_token, httponly=True, expires=cookie_access_exp, samesite="Lax")
	response.set_cookie(key="refresh", value=refresh_token, httponly=True, expires=cookie_refresh_exp, samesite="Lax", path="/user/api/token/refresh")
	return response

'''
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
		if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
			return JsonResponse({"message": "error"})
		User.objects.create_user(username=username, email=email, password=password)
		user = authenticate(request, username=username, password=password)
		if not user:
			return JsonResponse({"message": "error"})
	return JsonResponse({"message": "success"})
'''

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
		UserAccount.obejcts.create_user(username=username, email=email, password=password)
		user = authenticate(request, username=username, password=password)
		if not user:
			return JsonResponse({"message": "error"})
	return JsonResponse({"message": "success"})

# has to send tokens to blacklist
@require_http_methods(["POST"])
def api_logout(request):
	if not request.token_data:
		return JsonResponse({"message": "error"})
	response = JsonResponse({"message": "success"})
	response.delete_cookie("access")
	response.delete_cookie("refresh", path="/user/api/token/refresh")
	return response

def api_info(request):
	res_data = {
		"user": request.token_data.get("name")
	}
	return JsonResponse(res_data)


# Utils functions
def generate_jwt(username, id):
	token = jwt.encode(
		{
			"token_type": "access",
			"sub": id,
			"iat": datetime.utcnow(),
			"exp": datetime.utcnow() + timedelta(days=1)
 		},
		jwt_secret_key,
		algorithm='HS256'
	)
	return token

def generate_token(user_id, name, token_type):
	iat = datetime.utcnow()
	if token_type == ACCESS_TOKEN:
		exp = iat + timedelta(minutes=1)
	else:
		exp = iat + timedelta(days=1)
	token = jwt.encode(
		{
			"token_type": token_type,
			"sub": user_id,
			"name": name,
			"iat": iat,
			"exp": exp,
			"jti": str(uuid.uuid4())
 		},
		jwt_secret_key,
		algorithm='HS256'
	)
	return token
