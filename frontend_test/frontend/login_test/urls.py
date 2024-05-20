from django.urls import path
from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("login/", views.userLogin, name="userLogin"),
	path("signup/", views.userSignup, name="userSignup"),
	path("logout/", views.userLogout, name="userLogout"),
	path("info/", views.info, name="info"),
	path("refresh/", views.refresh, name="refresh"),
]