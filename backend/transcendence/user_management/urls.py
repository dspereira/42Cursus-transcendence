from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.userLogin, name="userLogin"),
    path("logout", views.userLogout, name="userLogout"),
    path("signin", views.userSignin, name="userSignin"),
]