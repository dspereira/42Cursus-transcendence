from custom_decorators import accepted_methods
from django.http import JsonResponse

@accepted_methods(['GET'])
def check(request):
	return JsonResponse({"message": f"API Server is Online!"}, status=200)
