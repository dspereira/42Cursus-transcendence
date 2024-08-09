from custom_utils.input_checker import InputChecker
import json

class InputValidationMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response
		self.input_checker = InputChecker()

	def __call__(self, request):

		if request.GET:
			request.GET = self.__get_query_params_correct(request.GET)

		if request.body:
			body = self.__get_body_correct(body=json.loads(request.body))
			request._body = json.dumps(body).encode('utf-8')

		response = self.get_response(request)
		return response

	def __get_query_params_correct(self, query_params):
		if not query_params:
			return query_params
		new_query_params = query_params.copy()
		for key, values in query_params.lists():
			for value in values:
				new_value = self.input_checker.get_valid_input(value)
				new_query_params.setlist(key, new_value)
		return new_query_params

	def __get_body_correct(self, body):
		new_body = body.copy()
		for key, value in body.items():
			valid_value = self.input_checker.get_valid_input(value)
			new_body[key] = valid_value
		return new_body
