from django.shortcuts import render

def index(request):
	return render(request, "index.html")

def configure_2fa(request):
	return render(request, "configure_2fa.html")

def authWithCodeGeneration(request):
	return render(request, "authWithCodeGeneration.html")

def configuration(request):
	return render(request, "configuration.html")

def update_configuration(request):
	return render(request, "update_configuration.html")
