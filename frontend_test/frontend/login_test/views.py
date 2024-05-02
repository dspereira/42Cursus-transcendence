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

def email_verification(request):
	return render(request, "login_test/email_verify.html")

def email_sended(request):
	return render(request, "login_test/email_sended.html")

def email_already_verified(request):
	return render(request, "login_test/email_already_verified.html")

def resend_email_verification(request):
	return render(request, "login_test/resend_email_verification.html")
