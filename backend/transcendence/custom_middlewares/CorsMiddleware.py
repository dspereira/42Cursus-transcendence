from django.http import HttpResponse

# Configurations of cors headers
origin_name = "Access-Control-Allow-Origin"
origin_data = [
	"http://127.0.0.1:8080",
]

headers_name = "Access-Control-Allow-Headers"
headers_data = [
	"Content-Type",
]

methods_name = "Access-Control-Allow-Methods"
methods_data = [
	"GET",
	"POST",
	"DELETE",
]

credentials_name = "Access-Control-Allow-Credentials"
credentials_data = [
	"true"
]

class CorsMiddleware:

	def __init__(self, get_response):
		self.get_response = get_response

	def __call__(self, request):
		if request.method == "OPTIONS":
			response = HttpResponse()
			self.process_response(response)
			return response
		return self.process_response(self.get_response(request))

	def process_response(self, response):
		self.add_new_header(response, origin_name, origin_data)
		self.add_new_header(response, headers_name, headers_data)
		self.add_new_header(response, methods_name, methods_data)
		self.add_new_header(response, credentials_name, credentials_data)
		return response

	def add_new_header(self, response, name, data):
		response[name] = ",".join(data)
