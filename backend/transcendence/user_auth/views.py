from django.contrib.auth import authenticate
from django.http import JsonResponse
from user_auth.models import User, BlacklistToken
import json
from custom_decorators import login_required, accepted_methods

from .auth_utils import login as user_login
from .auth_utils import logout as user_logout
from .auth_utils import refresh_token as user_refresh_token
from .auth_utils import update_blacklist

from custom_utils.models_utils import ModelManager

@accepted_methods(["POST"])
def register(request):
	if request.body:
		user_model = ModelManager(User)
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
		if user_model.filter(username=username):
			return JsonResponse({"message": "Username already exists"}, status=409)
		if user_model.filter(email=email):
			return JsonResponse({"message": "Email already exists"}, status=409)
		user = user_model.create(username=username, email=email, password=password)
		if not user:
			return JsonResponse({"message": "Error creating user"}, status=500)

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
	user_model = ModelManager(User)
	if request.access_data:
		user = user_model.get(id=request.access_data.sub)
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


# Just for test, needs to be removed
@accepted_methods(["GET"])
@login_required
def apiGetUserInfo(request):

	user_model = ModelManager(User)
	user = user_model.get(id=request.access_data.sub)
	res_data = {
		"id": user.id,
		"user": user.username,
	}
	return JsonResponse(res_data)

# Just for test, needs to be removed
@accepted_methods(["GET"])
@login_required
def apiGetUsersList(request):

	#os.system("clear")

	users_list = User.objects.all()
	users_count = User.objects.count()

	users_data = []
	for user in users_list:
		users_data.append({
			'id': user.id,
			'username': user.username,
		})

	result_print = "------------------------------------------\n"
	if (users_count):
		for user in users_data:
			result_print += f'{user["id"]} | {user["username"]}\n'
	else:
		result_print += "There is no Users inside DataBase\n"
	result_print += "------------------------------------------\n"

	response = {"message": result_print, "users_count": users_count, "users_list": users_data}

	return JsonResponse(response)


# Test views
@accepted_methods(["GET"])
@login_required
def get_user_id(request):
	user_model = ModelManager(User)
	if request.access_data:
		user = user_model.get(id=request.access_data.sub)
	else:
		user = None

	if user:
		id = user.id
	else:
		return JsonResponse({"message": "No data, some errors occurred"})
		
	res_data = {
		"user_id": id
	}
	return JsonResponse(res_data)

@accepted_methods(["GET"])
@login_required
def get_username(request):
	user_model = ModelManager(User)
	if request.access_data:
		user = user_model.get(id=request.access_data.sub)
	else:
		user = None

	if user:
		username = user.username
	else:
		return JsonResponse({"message": "No data, some errors occurred"})
		
	res_data = {
		"username": username
	}
	return JsonResponse(res_data)


@accepted_methods(["GET"])
@login_required
def get_user_email(request):
	user_model = ModelManager(User)
	if request.access_data:
		user = user_model.get(id=request.access_data.sub)
	else:
		user = None

	if user:
		email = user.email
	else:
		return JsonResponse({"message": "No data, some errors occurred"})
		
	res_data = {
		"email": email
	}
	return JsonResponse(res_data)

@accepted_methods(["GET"])
def check_login_status(request):
	if request.access_data:
		is_logged_in = True
	else:
		is_logged_in = False
	return JsonResponse({"logged_in": is_logged_in})