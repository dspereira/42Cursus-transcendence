from django.core.management.base import BaseCommand
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization
import os

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

def exist_already_cryptographer_keys(env_file_path):
	if os.path.exists(env_file_path):
		with open(env_file_path, 'r') as env_file:
			env_content = env_file.read()
		if "CRYPTOGRAPHER_PRIVATE_KEY" in env_content and "CRYPTOGRAPHER_PUBLIC_KEY" in env_content:
			return True
		return False

class Command(BaseCommand):
	help = 'Generate and print private and public keys'

	def handle(self, *args, **options):

		env_file_path = '.env'

		if exist_already_cryptographer_keys(env_file_path):
			self.stdout.write(self.style.ERROR("CRYPTOGRAPHER KEYS already at .env file."))
			return

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

		with open(env_file_path, 'a') as env_file:
			env_file.write(f"CRYPTOGRAPHER_PRIVATE_KEY=\"{private_key_pem.decode('utf-8')}\"\n")
			env_file.write(f"CRYPTOGRAPHER_PUBLIC_KEY=\"{public_key_pem.decode('utf-8')}\"\n")

		if exist_already_cryptographer_keys(env_file_path):
			self.stdout.write(self.style.SUCCESS("CRYPTOGRAPHER KEYS created in .env file."))
		else:
			self.stdout.write(self.style.ERROR("Failed to create CRYPTOGRAPHER KEYS in .env file."))
