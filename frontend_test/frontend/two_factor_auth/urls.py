from django.urls import path
from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("generate_otp/", views.authWithCodeGeneration, name="authWithCodeGeneration"),
	path("configure_2fa/", views.configure_2fa, name="configure_2fa"),
	path("configuration/", views.configuration, name="configuration"),
	path("update_configuration/", views.update_configuration, name="update_configuration"),
	path("auth_with_qrcode/", views.auth_with_qrcode, name="auth_with_qrcode"),
	path("auth_with_phone/", views.auth_with_phone, name="auth_with_phone"),
	path("auth_with_email/", views.auth_with_email, name="auth_with_email"),
]
