from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse


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


def apiLogin(request):

	print("View Processing ...")

	if request.method == "OPTIONS":
		data = {
        'mesage': 'OPTIONS',
        'status': 'ok'
    	}
	else:
		print("entra aqui")
		data = {
			'mesage': 'test json',
			'status': 'ok'
		}

	return JsonResponse(data)