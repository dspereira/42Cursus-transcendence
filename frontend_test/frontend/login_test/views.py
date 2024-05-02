from django.shortcuts import render

# Create your views here.

def index(request):
	return render(request, "login_test/index.html")

def userLogin(request):
	return render(request, "login_test/login.html")

def userSignup(request):
	return render(request, "login_test/signup.html")

def userLogout(request):
	return render(request, "login_test/logout.html")

def info(request):
	return render(request, "login_test/info.html")

def chat(request):
	return render(request, "login_test/chat.html")

def refresh(request):
	return render(request, "login_test/refresh.html")

def profilepic(request):
	return render(request, "login_test/profilepic.html")
