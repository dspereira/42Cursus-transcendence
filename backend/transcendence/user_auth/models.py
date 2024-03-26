from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class BlacklistToken(models.Model):
    jti = models.CharField(max_length=255, unique=True, db_index=True, null=False)
    exp = models.IntegerField (null=False)

    def __str__(self):
        return f"ID {self.id}: Token {self.jti} expires at {self.exp}"

    class Meta:
        db_table = 'blacklisted_tokens'

class UserManager(BaseUserManager):
    def create_user(self, username, email, password):
        if not username:
            raise ValueError("Username field is required!")
        if not email:
            raise ValueError("Email field is required!")
        if not password:
            raise ValueError("Password field is required!")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user
 
    def create_superuser(self, username, email, password):
        user = self.create_user(username=username, email=email, password=password)
        user.save()
        return user

class User(AbstractBaseUser):
    email = models.EmailField(("email address"), unique=True)
    username = models.CharField(max_length=50, blank=False, null=False, unique=True)

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
   
    objects = UserManager()

    class Meta:
        db_table = 'auth_users'
