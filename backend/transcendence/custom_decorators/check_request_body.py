from django.http import JsonResponse
import json
import sys

SUCCESS = "\033[1m\033[32m"
ERROR = "\033[1m\033[31m"
RESET = "\033[0m"

def check_request_body(body_objects: list[str] = None):
	def decorator(func):
		def wrapper(request, *args, **kwargs):
			if request.content_type == 'application/json':
				loaded_body = __get_loaded_body(request.body)
				if not loaded_body:
					print(f'{ERROR}Failed to load JSON body.{RESET}')
					return JsonResponse({"message": "Invalid body."}, status=400)
				if not __exist_objects_in_body(body_objects, loaded_body):
					print(f'{ERROR}Missing Objects in Body{RESET}')
					return JsonResponse({"message": "Invalid body."}, status=400)
			print(f'{SUCCESS}Body checked with SUCCESS.{RESET}')
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
