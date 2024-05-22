import re
import html
import json


class DataSanitize:

	def __init__(self, get_response):

		self.get_response = get_response

	def __call__(self, request):

		print(f"before data sanitize: {request.body}")
		if request.body:
			sanitized_body = self._sanitize_input(request.body)
			try:
				request._body = sanitized_body
			except Exception as e:
				print(f"Error sanitizing request body: {e}")
		print(f"after sanitize: {request.body}")
		return self.get_response(request)


	def _sanitize_input(self, user_input):

		if isinstance(user_input, bytes):
			user_input = user_input.decode('utf-8')
		
		try:
			data = json.loads(user_input)

			for key, value in data.items():
				if isinstance(value, str):
					if key != "password":
						if key == "email":
							data[key] = self._validate_email(value)
						else:
							data[key] = self._sanitize_value(value)

			sanitized_user_input = json.dumps(data)

			return sanitized_user_input.encode('utf-8')
		
		except json.JSONDecodeError:

			return html.escape(user_input).encode('utf-8')


	def _sanitize_value(self, user_input):

		sql_keywords = [
			"SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE", "EXECUTE", "--", ";", "/*", "*/", "@@", "@", "'"
		]
		for keyword in sql_keywords:
			user_input = re.sub(r"\b" + re.escape(keyword) + r"\b", "", user_input, flags=re.IGNORECASE)

		user_input = html.escape(user_input)
		return user_input
	

	def _validate_email(self, email):
		email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
		if re.match(email_regex, email): #sees if email has correct form
			return email_regex
		return None

