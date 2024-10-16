from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_profile_data, name='info'),
    path('exists/', views.exist_user_profile, name='exists'),
    path('image', views.get_image, name='image'),
    path('username/', views.username, name="username"),
]
