from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse

import json
import jwt
import uuid
from datetime import datetime, timedelta

# Just for testing purposes, the key must be 256 bit and it has to be in a .env file.
jwt_secret_key = "your-256-bit-secret"

ACCESS_TOKEN = "access"
REFRESH_TOKEN = "refresh"

def index(request):
	return render(request, "user_management/index.html", {})

def userLogin(request):

	if request.user.is_authenticated:
		return render(request, "user_management/index.html", {})

	if request.method == "POST":
		username = request.POST["username"]
		password = request.POST["password"]
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			return render(request, "user_management/index.html", {})
		else:
			return render(request, "user_management/login.html", {
				"success": False
			})

	return render(request, "user_management/login.html", {
		"success": True
	})

def userLogout(request):
	logout(request)
	return render(request, "user_management/index.html", {})

def userSignin(request):

	if request.method == "POST":

		username = request.POST["username"]
		email = request.POST["email"]
		password = request.POST["password"]

		if not username or not email or not password:
			return render(request, "user_management/signin.html", {
				"message": "Fail to create user."
			})		

		if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
			return render(request, "user_management/signin.html", {
				"message": "Username already exists."
			})
        
		user = User.objects.create_user(username=username, email=email, password=password)
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			return render(request, "user_management/index.html", {})

	return render(request, "user_management/signin.html", {})


# REST API test login
def apiLogin(request):
	if request.method == "POST" and request.body:
		req_data = json.loads(request.body)
		user = authenticate(request, username=req_data["username"], password=req_data["password"])
		if user:
			login(request, user)
			jwt_token = generate_jwt(req_data["username"], user.id)
			response = JsonResponse({"message": "Login Success", "success": True})
			expiration_date = datetime.utcnow() + timedelta(days=1)
			response.set_cookie(key="jwt_token", value=jwt_token, httponly=True, expires=expiration_date, samesite="Lax")
			return response

	return JsonResponse({"message": "Login Error", "success": "false"})

def apiSignin(request):

	req_data = None
	if request.method != "POST":
		return JsonResponse({"message": "Signin Error, not a valid method", "success": "false"})
	if request.method == "POST" and request.body:
		req_data = json.loads(request.body)
		email = req_data['email']
		username = req_data['username']
		password = req_data['password']
		if (not email or not username or not password):
			return JsonResponse({"message": "Signin Error", "success": "false"})
		if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
			return JsonResponse({"message": "User already exists", "success": "false"})
		User.objects.create_user(username=username, email=email, password=password)
		user = authenticate(request, username=username, password=password)
		if not user:
			return JsonResponse({"message": "Signin Error", "success": "false"})
	return JsonResponse({"message": "Signin Success", "success": "true"})

def apiLogout(request):

	if not request.user.username:
		return JsonResponse({"message": "No user loged", "success": "false"})

	logout(request)
	return JsonResponse({"message": "Logout Success", "success": "true"})

def apiTest(request):

	#print(request.is_authenticated)
	#print(request.user_id)
	#print(request.username)

	print(request.token_data)

	res_data = {
		"user": request.token_data.get("name")
		#"user": request.jwt_data["username"],
	}
	return JsonResponse(res_data)

def token_obtain_view(request):
	if request.method == "POST" and request.body:
		req_data = json.loads(request.body)
		user = authenticate(request, username=req_data["username"], password=req_data["password"])
		if user:
			login(request, user)
			access_exp = datetime.utcnow() + timedelta(minutes=15)
			refresh_exp = datetime.utcnow() + timedelta(days=1)
			res_data = {
				"access": generate_token(user_id=1, name=req_data["username"], token_type=ACCESS_TOKEN),
				"refresh": generate_token(user_id=1, name=req_data["username"], token_type=REFRESH_TOKEN)
			}
			response = JsonResponse(res_data)
			response.set_cookie(key="access", value=res_data["access"], httponly=True, expires=access_exp, samesite="Lax")
			response.set_cookie(key="refresh", value=res_data["refresh"], httponly=True, expires=refresh_exp, samesite="Lax", path="/user/api/token/refresh")
			return response
	return JsonResponse({"message": "Login Error", "success": "false"})

def token_refresh_view(request):

	# tem de ser POST

	# tem de ter token válido. Verificação no middleware

	access_token = generate_token(user_id=1, name="none", token_type=ACCESS_TOKEN)
	refresh_token = generate_token(user_id=1, name="none", token_type=REFRESH_TOKEN)
	response = JsonResponse({"success": "true"})
	access_exp = datetime.utcnow() + timedelta(minutes=15)
	refresh_exp = datetime.utcnow() + timedelta(days=1)
	response.set_cookie(key="access", value=access_token, httponly=True, expires=access_exp, samesite="Lax")
	response.set_cookie(key="refresh", value=refresh_token, httponly=True, expires=refresh_exp, samesite="Lax", path="/user/api/token/refresh")
	return response

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
		exp = iat + timedelta(minutes=15)
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