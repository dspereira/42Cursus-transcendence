import bleach
import re

class InputChecker():

	def __init__(self) -> None:
		self.allowed_tags = []
		self.chat_allowed_tags = ['b', 'i', 'u', 'strong', 'em', 'del']
		self.valid_input = None

	def get_valid_input(self, input_value):
		self.valid_input = bleach.clean(input_value, tags=self.allowed_tags, strip=False)
		return self.valid_input

	def get_valid_chat_input(self, input_value):
		self.valid_input = bleach.clean(input_value, tags=self.chat_allowed_tags, strip=False)
		return self.valid_input
