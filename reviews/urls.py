from django.urls import path
from . import views
from .views import BestDisciplinesAPIView, UserCreateView

urlpatterns = [
    path('best-disciplines/', BestDisciplinesAPIView.as_view(), name='best-disciplines'),
    path('search/', views.search, name='search'),
    path('register/', UserCreateView.as_view(), name='register'),
]
