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
    path("id", views.get_user_id, name="id"),
    path("username", views.get_username, name="username"),
    path("email", views.get_user_email, name="email"),
    path("login_status", views.check_login_status, name="check_login_status"),
    path("validate_email", views.validate_email, name="validate_email"),
    path("get-csrf-token", views.get_csrf_token, name="get-csrf-token"),
]
