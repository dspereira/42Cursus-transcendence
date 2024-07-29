from custom_utils.input_checker import InputChecker
from django.http import HttpResponse
import json

class InputValidationMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response
		self.input_checker = InputChecker()

	def __call__(self, request):

		flag = True

		if request.method == 'POST':
			querry_params = request.POST
		elif request.method == 'GET':
			querry_params = request.GET
		
		body = json.loads(request.body) if request.body else None

		print("\n--------------------------------------")
		print("Request Method:", request.method)
		print('URL:', request)
		print("Querry Params:")
		if querry_params:
			print(querry_params)
			if not self.__is_querry_params_correct(querry_params):
				flag = False
		else:
			print("Empty")
		print('Body:')
		if body:
			print(body)
			if not self.__is_body_correct(body):
				flag = False
		else:
			print('Empty')
		print("--------------------------------------\n")

		if flag:
			response = self.get_response(request)
			return response
		else:
			return HttpResponse(status=400)

	def __is_querry_params_correct(self, querry_params):
		print("\n--------------------------------------")
		for key, values in querry_params.lists():
			print(f"[{key}]: [{values}]")
			for value in values:
				if not self.input_checker.is_valid_input(value):
					return False
		print("--------------------------------------\n")
		return True

	def __is_body_correct(self, body):
		print("\n--------------------------------------")
		for key, value in body.items():
			print(f"[{key}]: [{value}]")
			if not self.input_checker.is_valid_input(value):
				return False
		print("--------------------------------------\n")
		return True
