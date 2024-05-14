from django.urls import path
from . import views

urlpatterns = [
    path('editbio', views.api_edit_bio, name='editbio'),
    path('updatepicture', views.api_update_profile_picture, name='updatepicture'),
    path('showimage', views.api_show_image, name='showimage'),
]
