from django.urls import path
from . import views

urlpatterns = [
    path('api/register/', views.UserCreate.as_view(), name='account-create'),
    path('api/login/', views.UserLogin.as_view(), name='account-login'),
    path('api/logout/', views.UserLogout.as_view(), name='account-logout'),
    path('api/authview/', views.AuthenticatedView.as_view(), name='auth-view'),
    path('api/userdetails/', views.UserDetialsView.as_view(), name='account-details'),
]
