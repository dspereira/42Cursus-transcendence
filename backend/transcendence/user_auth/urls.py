from django.urls import path
from . import views

urlpatterns = [
	path("register", views.register, name="register"),
	path("login", views.login, name="login"),
	path("logout", views.logout, name="logout"),
	path("refresh_token", views.refresh_token, name="refresh_token"), # mudar rota para refresh-token
	path("login_status", views.check_login_status, name="check_login_status"), # mudar rota para login-status
	path("validate-email", views.validate_email, name="validate_email"),
	path("resend-email-validation/", views.resend_email_validation, name="resend_email_validation"),
]
