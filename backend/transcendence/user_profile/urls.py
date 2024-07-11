from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_all_info, name='info'),
    path('image', views.get_image, name='image'),
    path('setnewconfigs', views.set_new_configs, name="setnewconfigs")
]
