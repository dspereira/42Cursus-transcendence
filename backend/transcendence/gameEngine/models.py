from django.db import models

# Create your models here.

class Paddle:
	def __init__(self, game, xPos, yPos, width, height):
		self.game = game
		self.x = xPos
		self.y = yPos
		self.width = width
		self.height = height
		self.ySpeed = 0
		self.maxSpeed = 15
	def update(self, keys):
		# self.speed = keys.vertical() * self.maxSpeed
		self.y += self.ySpeed
		if (self.y < 0):
			self.y = 0
		elif (self.y > self.game.height - self.height):
			self.y = self.game.height - self.height
	def getPos(self):
		return [self.x, self.y]