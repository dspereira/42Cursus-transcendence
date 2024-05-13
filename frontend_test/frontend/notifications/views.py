from django.shortcuts import render

# Create your views here.

def index(request):
	return render(request, "notifications/index.html")

def check_notifications(request):
	return render(request, "notifications/check_notifications.html")

def create_notifications(request):
	return render(request, "notifications/create_notifications.html")

def friend_request(request):
	return render(request, "notifications/friends_request.html")
