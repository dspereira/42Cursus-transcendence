from .EmailBodyGenerator import EmailBodyGenerator
from django.core.mail import send_mail
import traceback

class EmailSender:
	def __init__(self):
		self.body_generator = EmailBodyGenerator()

	def send_verification_code(self, receiver_email: str, code: str):
		try:
			send_mail(
				subject="BLITZPONG - VERIFICATION CODE",
				message="",
				html_message=self.body_generator.get_verication_code(code=code),
				from_email='settings.EMAIL_HOST_USER',
				recipient_list=[receiver_email],
				fail_silently=False,
				connection=None,
			)
			return True
		except Exception as e:
			print("An error occurred while sending the email:")
			print(traceback.format_exc())
			return False
