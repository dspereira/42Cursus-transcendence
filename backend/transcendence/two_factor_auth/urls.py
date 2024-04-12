from django.urls import path
from . import views

urlpatterns = [
	path('generate_otp', views.generateOTP, name='generateOTP'),
	path('validate_otp', views.validateOTP, name='validateOTP'),
	path('show_all_otps', views.printAllOtps, name='show_all_otps'), # Apenas para teste
	path('show_valid_otps', views.printValidOtps, name='show_valid_otps'), # Apenas para teste
	path('delete_invalid_otps', views.deleteAllInvalidOtps, name='delete_invalid_otps'), # Apenas para teste
]
