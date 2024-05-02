from django.urls import path
from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("login/", views.userLogin, name="userLogin"),
	path("signup/", views.userSignup, name="userSignup"),
	path("logout/", views.userLogout, name="userLogout"),
    path("info/", views.info, name="info"),
    path("refresh/", views.refresh, name="refresh"),
    path("email_verification/", views.email_verification, name="email_verification"),
    path("email_sended/", views.email_sended, name="email_sended"),
    path("email_already_verified/", views.email_already_verified, name="email_already_verified"),
    path("resend_email_verification/", views.resend_email_verification, name="resend_email_verification")
]
