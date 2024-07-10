from django.db import models

class ModelManager:

	def __init__(self, model: models.Model):
		self.model = model

	def get(self, **kwargs):
		try:
			return self.model.objects.get(**kwargs)
		except self.model.DoesNotExist as e:
			print(f"ModelManager Error get: \n{e}")
			return None
		except Exception as e:
			print(f"ModelManager Error get: \n{e}")
			return None

	def filter(self, *args, **kwargs):
		try:
			obj = self.model.objects.filter(*args, **kwargs)
			if obj.exists():
				return obj
			return None
		except Exception as e:
			print(f"ModelManager Error filter: \n{e}")
			return None

	def create(self, **kwargs):
		try:
			return self.model.objects.create(**kwargs)
		except Exception as e:
			print(f"ModelManager Error create: \n{e}")
			return None

	def all(self):
		try:
			return self.model.objects.all()
		except Exception as e:
			print(f"ModelManager Error all: \n{e}")
			return None

	def count(self):
		try:
			return self.model.objects.count()
		except Exception as e:
			print(f"ModelManager Error count: \n{e}")
			return None
