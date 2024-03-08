from django.urls import path
from . import views

urlpatterns = [
    path("api/signin", views.api_signin, name="api_signin"),
    path("api/logout", views.api_logout, name="api_logout"),
    path("api/info", views.api_info, name="api_info"),
    path("api/token", views.token_obtain_view, name="token_obtain"),
    path("api/token/refresh", views.token_refresh_view, name="token_refresh")

]