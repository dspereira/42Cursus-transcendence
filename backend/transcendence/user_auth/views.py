from django.contrib.auth import authenticate
from django.http import JsonResponse
from user_auth.models import User, BlacklistToken
import json
from custom_decorators import login_required, accepted_methods

from .auth_utils import login as user_login
from .auth_utils import logout as user_logout
from .auth_utils import refresh_token as user_refresh_token
from .auth_utils import update_blacklist
from .auth_utils import send_email_verification
from .auth_utils import get_jwt_data
from .auth_utils import add_email_token_to_blacklist
from .auth_utils import create_user_profile_info
from .auth_utils import create_user_settings
from .auth_utils import add_bot_as_friend
from custom_utils.auth_utils import is_valid_username
from custom_utils.auth_utils import is_username_bot_username

from two_factor_auth.two_factor import setup_default_tfa_configs
from two_factor_auth.two_factor import initiate_two_factor_authentication
from user_profile.models import UserProfileInfo

from custom_utils.models_utils import ModelManager
from custom_utils.blitzpong_bot_utils import send_custom_bot_message
from custom_utils.blitzpong_bot_utils import generate_welcome_message

user_model = ModelManager(User)

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
		if not is_valid_username(username=username):
			return JsonResponse({"message": "Invalid Username"}, status=409)
		if user_model.filter(username=username) or is_username_bot_username(username):
			return JsonResponse({"message": "Username already exists"}, status=409)
		if user_model.filter(email=email):
			return JsonResponse({"message": "Email already exists"}, status=409)
		user = user_model.create(username=username, email=email, password=password)
		if not user:
			return JsonResponse({"message": "Error creating user"}, status=409)
		send_email_verification(user)
		if not create_user_profile_info(user=user):
			return JsonResponse({"message": "Error creating user profile"}, status=409)
		if not create_user_settings(user=user):
			return JsonResponse({"message": "Error creating user settings"}, status=409)
		if not add_bot_as_friend(user=user):
			return JsonResponse({"message": "Error adding bot user as friend"}, status=409)
		send_custom_bot_message(user, generate_welcome_message(user.username))
	return JsonResponse({"message": "success"})

@accepted_methods(["POST"])
def login(request):
	if request.body:
		req_data = json.loads(request.body)
		username = req_data.get("username")
		password = req_data.get("password")
		if is_username_bot_username(username):
			return JsonResponse({"message": "Invalid credentials. Please check your username or password."}, status=401)
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
		user_id = request.access_data.sub
		user = user_model.get(id=user_id)
		if user:
			username = user.username
	else:
		is_logged_in = False
		user_id = None
		username = None
	return JsonResponse({"logged_in": is_logged_in, "id": user_id, "username": username})

@accepted_methods(["POST"])
def validate_email(request):
	
	message = "Empty Body!"
	validation_status = "fail"
	email_token = None

	if request.body:
		req_data = json.loads(request.body);
		email_token = req_data["email_token"]

	if email_token:
		message = f"Body with content !"
		email_token_data = get_jwt_data(email_token)

		if email_token_data:
			if email_token_data.type == "email_verification":
				user = user_model.get(id=email_token_data.sub)
				if user and user.active == False:
					user.active = True
					user.save()
					validation_status = "validated"
				elif user and user.active == True:
					validation_status = "active"
			add_email_token_to_blacklist(email_token_data)

	return JsonResponse({"message": message, "validation_status": validation_status})
