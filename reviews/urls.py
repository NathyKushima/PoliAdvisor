from django.urls import path
from . import views
from .views import BestDisciplinesAPIView, UserRegisterView, LoginView, discipline_details

urlpatterns = [
    path('best-disciplines/', BestDisciplinesAPIView.as_view(), name='best-disciplines'),
    path('search/', views.search, name='search'),
    path('register/', UserRegisterView.as_view(), name='user_register'),
    path('login/', LoginView.as_view(), name='login'),
    path('discipline/<int:discipline_id>/', discipline_details, name='discipline_details'),
]
