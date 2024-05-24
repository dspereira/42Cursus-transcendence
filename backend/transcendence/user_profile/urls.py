from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_get_all_info, name='info'),
    path('editbio', views.api_edit_bio, name='editbio'),
    path('updatepicture', views.api_update_profile_picture, name='updatepicture'),
    path('showimage', views.api_show_image, name='showimage'),
]
