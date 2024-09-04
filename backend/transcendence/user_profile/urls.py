from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_all_info, name='info'),
    path('exists/', views.exist_user_profile, name='exists'),
    path('image', views.get_image, name='image'),
    path('setimage', views.set_profile_picture, name='setimage'),
    path('setnewconfigs', views.set_new_configs, name="setnewconfigs")
]
