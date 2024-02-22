from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
import json


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
			sessionid = request.session.session_key
			return JsonResponse({"message": "Login Success", "success": "true"})

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


	print(request.user.id)
	print(request.user.username)

	res_data = {
		"user": request.user.username,
	}
	return JsonResponse(res_data)

""" CREATE TABLE IF NOT EXISTS "auth_user"
("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
 "password" varchar(128) NOT NULL,
 "last_login" datetime NULL,
 "is_superuser" bool NOT NULL,
 "username" varchar(150) NOT NULL UNIQUE,
 "last_name" varchar(150) NOT NULL,
 "email" varchar(254) NOT NULL,
 "is_staff" bool NOT NULL,
 "is_active" bool NOT NULL,
 "date_joined" datetime NOT NULL,
 "first_name" varchar(150) NOT NULL);
 """