from django.urls import path
from . import views

urlpatterns = [
    path("register", views.register, name="register"),
    path("login", views.login, name="login"),
    path("logout", views.logout, name="logout"),
    path("refresh_token", views.refresh_token, name="refresh_token"),
    path("info", views.info, name="info"),
    path("user_info", views.apiGetUserInfo, name="apiUserInfo"),
    path("users_list", views.apiGetUsersList, name="apiUsersList"),

    path("validate_email", views.validate_email, name="validate_email"),
]
