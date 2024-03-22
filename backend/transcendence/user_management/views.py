from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import JsonResponse
from user_management.models import BlacklistedToken, UserAccount


import json
#import jwt
#import uuid
#from datetime import datetime, timedelta

from django.views.decorators.http import require_http_methods
from custom_decorators import login_required

from datetime import datetime, timedelta


#from custom_utils.jwt_utils.generate_token import generate_access_token, generate_refresh_token
from custom_utils.jwt_utils import TokenGenerator


# Just for testing purposes, the key must be 256 bit and it has to be in a .env file.
jwt_secret_key = "your-256-bit-secret"


@require_http_methods(["POST"])
def token_obtain_view(request):
	if request.body:
		req_data = json.loads(request.body)
		user = authenticate(request, username=req_data["username"], password=req_data["password"])
		if user:
			token_gen = TokenGenerator(user.id, user.get_username())
			token_gen.generate_tokens()
			response = JsonResponse({"message": "success"})
			response.set_cookie(
				key="access", 
				value=token_gen.get_access_token(), 
				httponly=True, 
				expires=token_gen.get_access_token_exp(), 
				samesite="Lax", 
				path="/"
			)
			response.set_cookie(
				key="refresh", 
				value=token_gen.get_refresh_token(), 
				httponly=True, expires=token_gen.get_refresh_token_exp(), 
				samesite="Lax", 
				path="/user/api/token/refresh"
			)
			return response
	return JsonResponse({"message": "error"})


@require_http_methods(["POST"])
def token_refresh_view(request):

	black_listed = BlacklistedToken(jti = request.token_data["jti"], exp = request.token_data["exp"])
	black_listed.save()

	token = BlacklistedToken.objects.filter(jti="aca3393a-3828-4efe-88da-8e2d2876f58c")
	print(token)

	user_id = request.token_data["sub"]
	name = request.token_data["name"]
	
	token_gen = TokenGenerator(user_id, name)
	token_gen.generate_tokens()
	
	#access_token = generate_token(user_id, name, token_type=ACCESS_TOKEN)
	#refresh_token = generate_token(user_id, name, token_type=REFRESH_TOKEN)
	#access_token = generate_access_token(user_id, name)
	#refresh_token = generate_refresh_token(user_id, name)

	response = JsonResponse({"message": "success"})
	#cookie_access_exp = datetime.utcnow() + timedelta(minutes=15)
	#cookie_refresh_exp = datetime.utcnow() + timedelta(days=1)
	response.set_cookie(key="access", value=token_gen.get_access_token(), httponly=True, expires=token_gen.get_access_token_exp(), samesite="Lax", path="/")
	response.set_cookie(key="refresh", value=token_gen.get_refresh_token(), httponly=True, expires=token_gen.get_refresh_token_exp(), samesite="Lax", path="/user/api/token/refresh")
	return response

@require_http_methods(["POST"])
def api_signin(request):
	if request.body:
		req_data = json.loads(request.body)
		if req_data:
			email = req_data['email']
			username = req_data['username']
			password = req_data['password']
		if (not email or not username or not password):
			return JsonResponse({"message": "error"})
		if UserAccount.objects.filter(username=username).exists() or UserAccount.objects.filter(email=email).exists():
			return JsonResponse({"message": "error"})
		UserAccount.objects.create_user(username=username, email=email, password=password)
		user = authenticate(request, username=username, password=password)
		if not user:
			return JsonResponse({"message": "error"})
	return JsonResponse({"message": "success"})

# has to send tokens to blacklist
@require_http_methods(["POST"])
def api_logout(request):
	if not request.token_data:
		return JsonResponse({"message": "error"})
	response = JsonResponse({"message": "success"})
	response.delete_cookie("access")
	response.delete_cookie("refresh", path="/user/api/token/refresh")
	return response


#@login_required
def api_info(request):

	if request.access_data:
		print("existe dados")
	else:
		print("Não existe dados")

	res_data = {
		#"user": request.token_data.get("name")
		"user": "hell yha"
	}
	return JsonResponse(res_data)




'''
def generate_token(user_id, name, token_type):
	iat = datetime.utcnow()
	if token_type == ACCESS_TOKEN:
		exp = iat + timedelta(minutes=100)
	else:
		exp = iat + timedelta(days=1)
	token = jwt.encode(
		{
			"token_type": token_type,
			"sub": user_id,
			"name": name,
			"iat": iat,
			"exp": exp,
			"jti": str(uuid.uuid4())
 		},
		jwt_secret_key,
		algorithm='HS256'
	)
	return token
'''