from django.urls import path
from . import views
from .views import BestDisciplinesAPIView

urlpatterns = [
    path('best-disciplines/', BestDisciplinesAPIView.as_view(), name='best-disciplines'),
    path('api/search/', views.search, name='search'),
]
