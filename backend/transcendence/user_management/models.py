from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class BlacklistedToken(models.Model):
    jti = models.CharField(max_length=255, unique=True, db_index=True, null=False)
    exp = models.IntegerField (null=False)

    def __str__(self):
        return f"ID {self.id}: Token {self.jti} expires at {self.exp}"

    class Meta:
        db_table = 'blacklisted_tokens'


class UserAccountManager(BaseUserManager):
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

class UserAccount(AbstractBaseUser):
    email = models.EmailField(("email address"), unique=True)
    username = models.CharField(max_length=50, blank=False, null=False, unique=True)

    USERNAME_FIELD = 'username'
    EMAIL_FIELD = 'email'
   
    objects = UserAccountManager()

    class Meta:
        db_table = 'auth_users'



'''
 fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.CharField(max_length=200, unique=True)),
                ('name', models.CharField(max_length=200)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
'''

'''
CREATE TABLE IF NOT EXISTS "auth_users" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, 
    "password" varchar(128) NOT NULL, 
    "last_login" datetime NULL, 
    "email" varchar(254) NOT NULL UNIQUE, 
    "username" varchar(50) NOT NULL);
'''