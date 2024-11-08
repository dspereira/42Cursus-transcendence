from django.urls import path
from . import views

urlpatterns = [
	path('request-qr-code/', views.generate_qr_code, name='generate_qr_code'),
	path('request-phone/', views.generate_user_phone_code, name='generate_user_phone_code'),
	path('request-email/', views.generate_user_email_code, name='generate_user_email_code'),
	path('validate-otp/', views.validateOTP, name='validateOTP'),
	path('configured-2fa/', views.configured_2fa, name='configured_2fa'),
]
