from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_all_info, name='info'),
    path('getimage', views.get_image, name='getimage'),
    path('setnewconfigs', views.set_new_configs, name="setnewconfigs")
]
