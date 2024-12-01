from django.urls import path
from . import views
from .views import BestDisciplinesAPIView, UserRegisterView

urlpatterns = [
    path('best-disciplines/', BestDisciplinesAPIView.as_view(), name='best-disciplines'),
    path('search/', views.search, name='search'),
    path('register/', UserRegisterView.as_view(), name='user_register'),
]
