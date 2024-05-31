from .html_body.verification_code import verification_code_html
from .html_body.email_verification import email_verification_html

from custom_utils.jwt_utils import JwtData

class EmailBodyGenerator:
	def get_verication_code(self, code: str):
		result_html = verification_code_html.format(verification_code=code)
		return result_html

	def get_email_verication(self, token):
		print("==========================================")
		print(str(token))
		print("==========================================")
		email_verify_url = "http://127.0.0.1:8080/email_verification/?email_token=" + str(token)
		result_html = email_verification_html.format(email_verify_url=email_verify_url)
		return result_html
