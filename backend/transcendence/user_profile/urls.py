from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_all_info, name='info'),
    path('setbio', views.set_bio, name='editbio'),
    path('setpicture', views.set_profile_picture, name='updatepicture'),
    path('getimage', views.get_image, name='getimage'),
    path('setnewdefaultseed', views.set_new_default_seed, name='setnewdefaultseed'),
    path('setnewconfigs', views.set_new_configs, name="setnewconfigs")
]
