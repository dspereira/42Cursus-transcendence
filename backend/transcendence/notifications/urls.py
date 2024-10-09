from django.urls import path
from . import views

urlpatterns = [
	path('requests-notifications/', views.requests_notifications, name="requests-notifications"),
]
