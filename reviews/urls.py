from django.urls import path
from .views import BestDisciplinesAPIView

urlpatterns = [
    path('best-disciplines/', BestDisciplinesAPIView.as_view(), name='best-disciplines'),
]
