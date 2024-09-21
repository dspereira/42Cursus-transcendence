from django.urls import path
from . import views

urlpatterns = [
	path('request-qr-code', views.generate_qr_code, name='generate_qr_code'),
	path('request-phone', views.generate_user_phone_code, name='generate_user_phone_code'),
	path('request-email', views.generate_user_email_code, name='generate_user_email_code'),
	path('validate_otp', views.validateOTP, name='validateOTP'),
	path('validate_otp_qr_code', views.validateOTP_QR_Code, name='validateOTP_QR_Code'),
	path('is_already_configured', views.is_already_configured, name='is_already_configured'),
	path('configuration', views.configuration, name='configuration'),
	path('update_configurations', views.update_configurations, name='update_configurations'),
	path('get_current_configuration', views.get_current_settings, name='get_current_configuration'),
	path('is_qr_code_configured', views.is_qr_code_configured, name='is_qr_code_configured'),
	path('is_email_configured', views.is_email_configured, name='is_email_configured'),
	path('is_phone_configured', views.is_phone_configured, name='is_phone_configured'),    				# 
	path('configured-2fa/', views.configured_2fa, name='configured_2fa'),
]
