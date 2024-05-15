from django.shortcuts import render

def index(request):
	return render(request, "tournaments/index.html")

def tournament_control(request):
	return render(request, "tournaments/tournament_control.html")
