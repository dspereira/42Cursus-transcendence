from custom_utils.input_checker import InputChecker
import json

class InputValidationMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response
		self.input_checker = InputChecker()

	def __call__(self, request):

		if request.GET:
			request.GET = self.__get_query_params_correct(request.GET)

		if request.body and not request.FILES:
			body = self.__get_body_correct(body=request.body.decode('utf-8'))
			request._body = body.encode('utf-8')

		response = self.get_response(request)
		return response

	def __get_query_params_correct(self, query_params):
		if not query_params:
			return query_params
		new_query_params = query_params.copy()
		for key, values in query_params.lists():
			new_value = []
			for value in values:
				new_value.append(self.input_checker.get_valid_input(value))
			new_query_params.setlist(key, new_value)
		return new_query_params

	def __get_body_correct(self, body):
		new_body = self.input_checker.get_valid_input(body)
		return new_body
