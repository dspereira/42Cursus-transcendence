from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from dotenv import load_dotenv
import os

load_dotenv()

CRYPTOGRAPHER_PRIVATE_KEY = os.getenv('CRYPTOGRAPHER_PRIVATE_KEY')
CRYPTOGRAPHER_PUBLIC_KEY = os.getenv('CRYPTOGRAPHER_PUBLIC_KEY')

class Cryptographer:
	def __init__(self):
		private_key_bytes = self._load_private_key(CRYPTOGRAPHER_PRIVATE_KEY)
		public_key_bytes = self._load_public_key(CRYPTOGRAPHER_PUBLIC_KEY)
		self.private_key = serialization.load_pem_private_key(
			private_key_bytes,
			password=None,
			backend=default_backend()
		)
		self.public_key = serialization.load_pem_public_key(
			public_key_bytes,
			backend=default_backend()
		)

	def encrypt_message(self, message):
		encrypted_message = self.public_key.encrypt(
			message.encode(),
			padding.OAEP(
				mgf=padding.MGF1(algorithm=hashes.SHA256()),
				algorithm=hashes.SHA256(),
				label=None
			)
		)
		return encrypted_message

	def decrypt_message(self, encrypted_message):
		decrypted_message = self.private_key.decrypt(
			encrypted_message,
			padding.OAEP(
				mgf=padding.MGF1(algorithm=hashes.SHA256()),
				algorithm=hashes.SHA256(),
				label=None
			)
		).decode()
		return decrypted_message

	def _load_private_key(self, private_key_pem):
		private_key_bytes = private_key_pem.replace('"', '').encode('utf-8')
		return private_key_bytes

	def _load_public_key(self, public_key_pem):
		public_key_bytes = public_key_pem.replace('"', '').encode('utf-8')
		return public_key_bytes
