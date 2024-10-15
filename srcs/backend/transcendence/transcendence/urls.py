"""
URL configuration for transcendence project.

The `urlpatterns` list routes URLs to views. For more information please see:
	https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
	1. Add an import:  from my_app import views
	2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
	1. Add an import:  from other_app.views import Home
	2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
	1. Import the include() function: from django.urls import include, path
	2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path
from . import views

urlpatterns = [
	path('api/auth/', include('user_auth.urls')),
	path('api/two-factor-auth/', include('two_factor_auth.urls')),
	path('api/notifications/', include('notifications.urls')),
    path('api/profile/', include('user_profile.urls')),
    path('api/friends/', include('friendships.urls')),
    path('api/settings/', include('user_settings.urls')),
    path('api/game/', include('game.urls')),
    path('api/tournament/', include('tournament.urls')),
    path('api/check/', views.check)
]
