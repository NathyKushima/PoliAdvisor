from django.urls import path
from . import views

urlpatterns = [
    path('', views.envia_email_NewPassword, name='envia_email')
]