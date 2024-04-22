from .html_body.verification_code import verification_code_html

class EmailBodyGenerator:
	def get_verication_code(self, code: str):
		result_html = verification_code_html.format(verification_code=code)
		return result_html
