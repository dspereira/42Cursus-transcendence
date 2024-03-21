from django.http import JsonResponse

def login_required(func):
    def wrapper(request, *args, **kwargs):
        print(request.token_data)
        if request.token_data:
            return func(request, *args, **kwargs)
        return JsonResponse({"message": "Unauthorized"}, status=401)
    return wrapper