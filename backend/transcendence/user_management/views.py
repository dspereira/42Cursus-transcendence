from django.contrib.auth import authenticate
from django.http import JsonResponse
from user_management.models import User
import json
from custom_decorators import login_required, accepted_methods


from .auth_utils import login as user_login
from .auth_utils import logout as user_logout
from .auth_utils import refresh_token as user_refresh_token
from .auth_utils import update_blacklist


@accepted_methods(["POST"])
def register(request):
	if request.body:
		req_data = json.loads(request.body)
		if req_data:
			email = req_data.get('email')
			username = req_data.get('username')
			password = req_data.get('password')
		if not email:
			return JsonResponse({"message": "Email field cannot be empty"}, status=400)
		if not username:
			return JsonResponse({"message": "Username field cannot be empty"}, status=400)
		if not password:
			return JsonResponse({"message": "Password field cannot be empty"}, status=400)
		if User.objects.filter(username=username).exists():
			return JsonResponse({"message": "Username already exists"}, status=409)
		if User.objects.filter(email=email).exists():
			return JsonResponse({"message": "Email already exists"}, status=409)
		try:
			User.objects.create_user(username=username, email=email, password=password)
			user = authenticate(request, email_username=username, password=password)
			if not user:
				return JsonResponse({"message": "Error creating user"}, status=500)
		except Exception:
			return JsonResponse({"message": "Internal server error"}, status=500)
	return JsonResponse({"message": "success"})

@accepted_methods(["POST"])
def login(request):
	if request.body:
		req_data = json.loads(request.body)
		username = req_data.get("username")
		password = req_data.get("password")
		if not username:
			return JsonResponse({"message": "Username field cannot be empty"}, status=400)
		if not password:
			return JsonResponse({"message": "Password field cannot be empty"}, status=400)
		user = authenticate(request, email_username=username, password=password)
		if not user:
			return JsonResponse({"message": "Invalid credentials. Please check your username or password."}, status=401)
		response = user_login(JsonResponse({"message": "success"}), user)
		return response
	return JsonResponse({"message": "Empty request body"}, status=400)

@accepted_methods(["POST"])
def logout(request):
	if request.access_data:
		response = JsonResponse({"message": "success"})
		response = user_logout(response)
		update_blacklist(request.access_data, request.refresh_data)
		return response
	return JsonResponse({"message": "Unauthorized: Logout failed."}, status=401)

@accepted_methods(["POST"])
def refresh_token(request):
	if request.refresh_data:
		response = JsonResponse({"message": "success"})
		response = user_refresh_token(response, request.refresh_data.sub)
		update_blacklist(request.access_data, request.refresh_data)
		return response
	return JsonResponse({"message": "Invalid refresh token. Please authenticate again."}, status=401)

# Route test, remove in production
@accepted_methods(["GET"])
@login_required
def info(request):
	if request.access_data:
		user = User.objects.get(id=request.access_data.sub)
	else:
		user = None

	if user:
		username = user.username
	else:
		username = "Not Loged"		
	res_data = {
		"user": username
	}
	return JsonResponse(res_data)
