import bleach
import re

class InputChecker():

	def __init__(self) -> None:
		self.allowed_tags = []
		self.chat_allowed_tags = ['b', 'i', 'u', 'strong', 'em', 'del']
		self.valid_input = None

	def get_valid_input(self, input_value):

		print("-------------------------------------------------")
		print(input_value)
		print(type(input_value))
		print("-------------------------------------------------")

		input_value = str(input_value)
		self.valid_input = bleach.clean(input_value, tags=self.allowed_tags, strip=False)

		print("-------------------------------------------------")
		print(self.valid_input)
		print(type(self.valid_input))
		print("-------------------------------------------------")

		return self.valid_input

	def get_valid_chat_input(self, input_value):
		input_value = str(input_value)
		self.valid_input = bleach.clean(input_value, tags=self.chat_allowed_tags, strip=False)
		return self.valid_input
