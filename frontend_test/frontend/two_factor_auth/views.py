from django.shortcuts import render

def index(request):
	return render(request, "index.html")

def setUp2FA(request):
	return render(request, "setup2fa.html")
