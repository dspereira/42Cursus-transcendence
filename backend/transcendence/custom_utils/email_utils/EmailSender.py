from .EmailBodyGenerator import EmailBodyGenerator
from django.core.mail import send_mail
import traceback

TYPE_VERIFICATION_CODE = "SEND VERIFICATION CODE"
TYPE_EMAIL_VERIFICATION = "SEND EMAIL VERIFICATION"

class EmailSender:
	def __init__(self):
		self._body_generator = EmailBodyGenerator()

	def send_verification_code(self, receiver_email: str, code: str):
		content = self._body_generator.get_verication_code(code=code),
		return self._sender(
			type=TYPE_VERIFICATION_CODE,
			receiver_email=receiver_email,
			subject="BLITZPONG - VERIFICATION CODE",
			html_content=content
		)

	def send_email_verification(self, receiver_email: str, url: str):
		content = self._body_generator.get_email_verication(url=url)
		return self._sender(
			type=TYPE_EMAIL_VERIFICATION,
			receiver_email=receiver_email,
			subject="BLITZPONG - VALIDATE EMAIL",
			html_content=content
		)

	def _sender(self, type: str, receiver_email: str, subject, html_content: str):
		try:
			send_mail(
				subject=subject,
				message="",
				html_message=html_content,
				from_email='settings.EMAIL_HOST_USER',
				recipient_list=[receiver_email],
				fail_silently=False,
				connection=None,
			)
			return True
		except Exception as e:
			print(type)
			print("An error occurred while sending the email:")
			print(traceback.format_exc())
			return False
