from django.urls import path
from . import views
from .SettingsView import SettingsView

urlpatterns = [
	path('', SettingsView.as_view(), name='info'),
]
