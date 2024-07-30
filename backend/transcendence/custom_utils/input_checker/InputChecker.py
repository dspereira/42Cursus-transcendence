import bleach
import re

class InputChecker():

	def __init__(self) -> None:
		self.allowed_tags = ['b', 'i', 'u', 'strong', 'em']
		self.valid_input = None

	def get_valid_input(self, input_value):
		self.valid_input = bleach.clean(input_value, tags=self.allowed_tags, strip=True)
		return self.valid_input
