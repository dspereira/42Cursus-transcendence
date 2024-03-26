from django.http import JsonResponse

def login_required(func):
	def wrapper(request, *args, **kwargs):
		if request.access_data:
			return func(request, *args, **kwargs)
		return JsonResponse({"message": "Unauthorized. Login_required"}, status=401)
	return wrapper