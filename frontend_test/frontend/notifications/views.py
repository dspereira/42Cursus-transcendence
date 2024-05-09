from django.shortcuts import render

# Create your views here.

def index(request):
	return render(request, "notifications/index.html")

def check_notifications(request):
	return render(request, "notifications/check_notifications.html")