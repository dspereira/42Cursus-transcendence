from django.shortcuts import render

# Create your views here.

def index(request):
	return render(request, "login_test/index.html")

def userLogin(request):
	return render(request, "login_test/login.html")

def userSignin(request):
	return render(request, "login_test/signin.html")

def info(request):
	return render(request, "login_test/info.html")

