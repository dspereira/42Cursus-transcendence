from django.shortcuts import render

# Create your views here.

def index(request):
	print(" --- I am here ! --- ")
	return render(request, "chat/index.html")
