from django.urls import path
from . import views
from .SettingsView import SettingsView

urlpatterns = [
	path('', SettingsView.as_view(), name='info'),
	path('setnewsettings', views.set_new_settings, name="setnewsettings"),
	path('getgametheme', views.get_game_theme, name="getgametheme"),
	path('getlanguage', views.get_language, name="getlanguage"),
]
