from django.core.management.base import BaseCommand
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

def generate_private_key():
	private_key = rsa.generate_private_key(
		public_exponent=65537,
		key_size=2048,
		backend=default_backend()
	)
	return private_key

def generate_public_key(private_key):
	public_key = private_key.public_key()
	return public_key

class Command(BaseCommand):
	help = 'Generate and print private and public keys'

	def handle(self, *args, **options):
		private_key = generate_private_key()
		public_key = generate_public_key(private_key)

		private_key_pem = private_key.private_bytes(
			encoding=serialization.Encoding.PEM,
			format=serialization.PrivateFormat.TraditionalOpenSSL,
			encryption_algorithm=serialization.NoEncryption()
		)

		public_key_pem = public_key.public_bytes(
			encoding=serialization.Encoding.PEM,
			format=serialization.PublicFormat.SubjectPublicKeyInfo
		)

		print("--------------------------------------------")
		print(f"Private Key: {private_key_pem}")
		print(f" Public Key: {public_key_pem}")
		print("--------------------------------------------")

		# self.stdout.write("--------------------------------------------")
		# self.stdout.write(f"Private Key: {private_key.save_pkcs1().hex()}")
		# self.stdout.write(f"Public Key: {public_key.save_pkcs1().hex()}")
		# self.stdout.write("--------------------------------------------")
