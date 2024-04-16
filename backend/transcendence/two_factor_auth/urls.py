from django.urls import path
from . import views

urlpatterns = [
	path('generate_otp', views.generateOTP, name='generateOTP'),
	path('validate_otp', views.validateOTP, name='validateOTP'),
]
