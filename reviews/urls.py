from django.urls import path
from . import views
from .views import BestDisciplinesAPIView, UserRegisterView, LoginView, LogoutView, discipline_details

urlpatterns = [
    path('best-disciplines/', BestDisciplinesAPIView.as_view(), name='best-disciplines'),
    path('search/', views.search, name='search'),
    path('register/', UserRegisterView.as_view(), name='user_register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user-info/', views.get_user_info, name='user_info'),
    path('user-interactions/', views.get_user_interactions, name='user_interactions'),
    path('discipline/<int:discipline_id>/', discipline_details, name='discipline_details'),
    path('comments/<int:discipline_id>/', views.get_discipline_comments, name='discipline-comment'),
    path('like/<int:comment_id>/', views.like_comment, name='like-comment'),
    path('create-comment/', views.create_comment, name='create-comment'),
    path('evaluate/<int:discipline_id>/', views.evaluate_discipline , name='evaluate-discipline'),
    path('report-comment/', views.report_comment, name='report-comment'),
]
