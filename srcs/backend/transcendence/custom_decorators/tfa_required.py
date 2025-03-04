from django.http import JsonResponse

def tfa_required(func):
	def wrapper(request, *args, **kwargs):
		if request.tfa_data:
			return func(request, *args, **kwargs)
		return JsonResponse({"message": "Unauthorized. Two Factor Auth token has expired."}, status=401)
	return wrapper
