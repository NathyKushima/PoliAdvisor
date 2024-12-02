from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BestDisciplinesAPIView, UserCreateView, DisciplineDetailView, UserRegisterView, LoginView,

urlpatterns = [
    path('best-disciplines/', BestDisciplinesAPIView.as_view(), name='best-disciplines'),
    path('search/', views.search, name='search'),
    path('register/', UserRegisterView.as_view(), name='user_register'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', UserCreateView.as_view(), name='register'),

]
