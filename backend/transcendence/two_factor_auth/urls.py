from django.urls import path
from . import views

urlpatterns = [
	path('generate_otp', views.generateOTP, name='generateOTP'),
	path('validate_otp', views.validateOTP, name='validateOTP'),
	path('is_already_configured', views.is_already_configured, name='is_already_configured'),
	path('configuration', views.configuration, name='configuration'),
	path('update_configurations', views.update_configurations, name='update_configurations'),
	path('get_current_configuration', views.get_current_settings, name='get_current_configuration'),
	path('get_all_used_otps', views.get_all_used_otps, name='get_all_used_otps'), # Apenas para teste
]
