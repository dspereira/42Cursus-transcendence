from .html_body.verification_code import verification_code_html
from .html_body.email_verification import email_verification_html

class EmailBodyGenerator:
	def get_verication_code(self, code: str):
		result_html = verification_code_html.format(verification_code=code)
		return result_html

	def get_email_verication(self, user_email: str):
		result_html = email_verification_html.format(user_email=user_email, email_token="123456789")
		return result_html
