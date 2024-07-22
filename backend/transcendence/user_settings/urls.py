from django.urls import path
from . import views

urlpatterns = [
	path('', views.get_all_info, name='info'),
	path('setnewsettings', views.set_new_settings, name="setnewsettings"),
	path('getgametheme', views.get_game_theme, name="getgametheme"),
	path('getlanguage', views.get_language, name="getlanguage"),
]
