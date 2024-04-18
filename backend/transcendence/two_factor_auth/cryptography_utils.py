from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import serialization

CRYPTOGRAPHER_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEAyZPUxmyBRQGw7VeASfed56HfBdKoHpbU5nmCl1sdVu7PoM2A\nbCp1Dffxsak7RHbSvVd3yewVH35S+3ZplFqihzB+aENicqYcFIHJGpgAFPPvvogZ\nGCEG+YM4wGSOVY5jLoTzeYDEFgFC/jqugBIuSWY2K+hZblqmcmjSQkAjQ3P8bReM\nLfacNdoUgCfPmMEWbnZyMBqVb2h+qyBztcw0JNe3yCHs1/cfOJLG1phrgHPDXpla\nCW3SLPkosdeTDcm0mbq0gbCVFN03aT6PX3+mfctIcIMV7+gBLzonLVn6XMJX8Gj9\n4fCI9bXU/FWmrAs6o/M2J2mBrF3U6sP7hmhMRQIDAQABAoIBABtiOMqH3PvJ4gYs\nF+J0gAACjnCVEH+vT9bLdQEowJCZup0GrcaD8gjmwO+4pLOFTNWp9zz4FFqF57H/\ngRJFScUBwnpZhRs8E555jx9MvN4b0VrZ1Ebh3bexqtkAEBHxWOnt58F+y6SNoVM2\nF5SQY7dW6k8Grnd+WxQ5xy521hOIhWVJ2gAJOCBf4gX+Fi6bfndmYw0G31773Ydi\nSnAmZ2YALV+ZmDhwaWyOgikuNJqhswE+exQyxXvzEg2mzHqnSD6CxIXNa4VgmXMO\nhlniLM+X0ml756QhP3fbMnghmrqQoOSZ+8j3Ix/z6ukLYh1+lPaxR078JiI5VFMt\nPwIaZbUCgYEA6zEBiz58RdLU7Lp8oCYocPqGhQ1QGfwk1pVcAzNLqzGUXHaRgO7W\najL0F2M+5oRkM5+lgrvgCOS0+38rrMbLqu1XBBQlK4ivoDLyyoB4peyjgUxeymdL\nEGRmiOOUCgOTq/NtDrcivcUZXecm7BSjNG4ovPpu7Gwf6UxOzq/NmbcCgYEA22l7\nYhmCq+n2y6WTXyjv2ytHeGj7hpUSlkAKmvBDEjY+g+W8enWadPymg8C+8Th+ZCfr\nsbrwkQv7MqtUOUczUpJWbrUzuyEmoxj3nz+vMflBttQjV7Ib2Fkc4ALc44w9YYIB\nW5KUoKF/4ySHZxehdlgd3GY+jg035Rsew1Qa+eMCgYEAnSUQYAZvKIQ3arkr/iGg\n0eRCr3H2vHYB8zK22RiUDZ3CAInkrJ5ou2qyN1JDu+hnvyqDfzei+K4/0u7ksrvd\nZ6bPhlUjhNP+bO691NpEQrE7inAJwfmEaT58WCifSJWdPL4Yd0WcO+oPCfQhyIn9\nhlG4fJRkOyn/pHUtDuLeYD8CgYEAsSvj7bsbwSYTmy4Aan7r79Zqx9g+AtatQ5ZC\n+gm4nyQeJvOD1n7QUlcRPqKNjMtJhCaYM9P4HafHF4sxX28XCj4QfSTkuN50DI9E\npNsP5RKY9cEnKNExmumaX2jwZO4BQpNv9TnPukWutwPwMlbqkl1k/2uwZ5RU5jOY\nC7IGdnECgYEA3TD+F8+XAq335zVtTNNW7Xk7OgoKcMWkEyeMfqssgK1ZyyTOtsfL\nxeOc2l20t2tv65gzBDSiRgf/83lZQDHxIjDyQmJQyQTkhfGy/8eO3cbNFXl6SAp5\n9iGnQk3JfWFwKMHhvaM/foB6dOtix3SDTqogpGiKgMVtGMUm20HzqJk=\n-----END RSA PRIVATE KEY-----\n"
CRYPTOGRAPHER_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyZPUxmyBRQGw7VeASfed\n56HfBdKoHpbU5nmCl1sdVu7PoM2AbCp1Dffxsak7RHbSvVd3yewVH35S+3ZplFqi\nhzB+aENicqYcFIHJGpgAFPPvvogZGCEG+YM4wGSOVY5jLoTzeYDEFgFC/jqugBIu\nSWY2K+hZblqmcmjSQkAjQ3P8bReMLfacNdoUgCfPmMEWbnZyMBqVb2h+qyBztcw0\nJNe3yCHs1/cfOJLG1phrgHPDXplaCW3SLPkosdeTDcm0mbq0gbCVFN03aT6PX3+m\nfctIcIMV7+gBLzonLVn6XMJX8Gj94fCI9bXU/FWmrAs6o/M2J2mBrF3U6sP7hmhM\nRQIDAQAB\n-----END PUBLIC KEY-----\n"

class Cryptographer:
	def __init__(self):
		self.private_key = self._load_private_key(CRYPTOGRAPHER_PRIVATE_KEY)
		self.public_key = self._load_private_key(CRYPTOGRAPHER_PUBLIC_KEY)

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
		private_key = serialization.load_pem_private_key(
			private_key_pem.encode(),
			password=None
		)
		return private_key

	def _load_public_key(self, public_key_pem):
		public_key = serialization.load_pem_public_key(
			public_key_pem.encode()
		)
		return public_key
