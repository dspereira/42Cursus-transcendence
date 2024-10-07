from django.http import JsonResponse
from django import forms
import json
import sys

ERROR = "\033[1m\033[31m"
RESET = "\033[0m"

AVAILABLE_CONTENT_TYPES = ['application/json', 'multipart/form-data']

class UploadedForm(forms.Form):
    pass

def check_request_body(body_objects: list[str] = None):
	def decorator(func):
		def wrapper(request, *args, **kwargs):

			if request.body:
				content_type = request.content_type
				if content_type in AVAILABLE_CONTENT_TYPES:
					if content_type == 'application/json':
						loaded_body = __get_loaded_body(request.body)
						if not loaded_body:
							return __handle_error(request, "Can't load body.", 400)
						if not __exist_objects_in_body(body_objects, loaded_body):
							return __handle_error(request, "Invalid body.", 400)
					elif content_type == 'multipart/form-data':
						if request.FILES:
							uploaded_form = UploadedForm(request.POST, request.FILES)
							if not uploaded_form.is_valid():
								return __handle_error(request, "Invalid form data.", 400)
				else:
					return __handle_error(request, "Not Supported Content Type", 415)
			return func(request, *args, **kwargs)
		return wrapper
	return decorator

def __get_loaded_body(request_body):
	loaded_body = None
	if request_body:
		try:
			body_unicode = request_body.decode('utf-8')
			loaded_body = json.loads(body_unicode)
		except Exception as e:
			print(f"LOAD BODY EXCEPTION:\n", e)
	return loaded_body

def __exist_objects_in_body(body_objects, loaded_body):
	if body_objects:
		for obj in body_objects:
			if not loaded_body.get(obj):
				return False
	return True

def __handle_error(request, info, status_code):
	error_msg = ERROR
	error_msg += "Code: " + str(status_code) + "\n"
	error_msg += "Request URL: " + str(request.build_absolute_uri()) + "\n"
	error_msg += "Error: " + (str(info) if info else "Invalid Body.")
	error_msg += RESET
	print(error_msg)
	return JsonResponse({"message": info}, status=status_code)
