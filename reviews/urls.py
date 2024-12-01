from . import views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BestDisciplinesAPIView, UserCreateView,  DisciplineDetailView

urlpatterns = [
    path('best-disciplines/', BestDisciplinesAPIView.as_view(), name='best-disciplines'),
    path('search/', views.search, name='search'),
    path('register/', UserCreateView.as_view(), name='register'),
    path('discipline/<int:discipline_id>/', DisciplineDetailView.as_view(), name='discipline-detail'),
]
