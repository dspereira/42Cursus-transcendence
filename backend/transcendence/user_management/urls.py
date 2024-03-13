from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.userLogin, name="userLogin"),
    path("logout", views.userLogout, name="userLogout"),
    path("signin", views.userSignin, name="userSignin"),
    path("api/login", views.apiLogin, name="apiLogin"),
    path("api/signin", views.apiSignin, name="apiSignin"),
     path("api/logout", views.apiLogout, name="apiLogout"),
    path("api/test", views.apiTest, name="apiTest"),

    path("api/user_info", views.apiGetUserInfo, name="apiUserInfo"),
]
