from django.http import JsonResponse

def accepted_methods(allowed_methods: list[str]):
	def decorator(func):
		def wrapper(request, *args, **kwargs):
			methods = [method.upper() for method in allowed_methods]
			method = request.method.upper()
			if method in methods:
				return func(request, *args, **kwargs)
			return JsonResponse({"message": "Method not allowed."}, status=405)
		return wrapper
	return decorator
