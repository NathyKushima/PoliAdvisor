from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.db.models import Q
from .models import Department, Discipline, UserTookDiscipline, User, Comment, UserCurtesComment
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.db.models import Q, Avg, Count, F, ExpressionWrapper
from django.db.models import Avg, Count
from rest_framework import status
from .serializers import UserSerializer, CommentSerializer, UserTookDisciplineSerializer
from django.contrib.auth import authenticate, login



class BestDisciplinesAPIView(APIView):
    def get(self, request):
        disciplines = (
            UserTookDiscipline.objects
            .values('discipline__id', 'discipline__name', 'discipline__discipline_code')
            .annotate(
                avg_teaching=Avg('note_teaching'),
                avg_material=Avg('note_material'),
                avg_difficulty=Avg('note_difficulty')
            )
            .order_by('-avg_difficulty', '-avg_teaching', '-avg_material')
        )

        best_disciplines = []
        selected_ids = set()

        for discipline in disciplines:
            if len(best_disciplines) >= 3:
                break

            if discipline['discipline__id'] not in selected_ids:
                best_disciplines.append(discipline)
                selected_ids.add(discipline['discipline__id'])

        return Response(best_disciplines)
    
class DisciplineAPIView(APIView):
    def get_disc_info(self, request, id):
        disciplines = (
            UserTookDiscipline.objects
            .values('discipline__id', 'discipline__name', 'discipline__discipline_code')
            .annotate(
                note_teaching=Avg('note_teaching'),
            
            )
            .order_by('-avg_difficulty', '-avg_teaching', '-avg_material')
        )

        discipline_right = []
        selected_ids = set()

        for discipline in disciplines:

            if discipline['discipline__id'] == discipline[id]:
                disciplines.append(discipline_right)
                selected_ids.add(discipline['discipline__id'])

        return Response(discipline_right)

@api_view(['GET'])
@login_required
def get_user_info(request):
    user = request.user
    user_data = User.objects.get(id=user.id)

    return Response({
        'username': user_data.username,
        'fullname': user_data.fullname,
        'email': user_data.email,
        'nusp': user_data.nusp,
        'start_date': user_data.start_date,
        'course': user_data.course,
        'photo': user_data.user_photo.url if user_data.user_photo else None,
        'initials': user_data.initials() 
    })

@api_view(['GET'])
@login_required
def get_user_interactions(request):
    user = request.user

    # Count related interactions
    evaluations_count = UserTookDiscipline.objects.filter(user=user).count()
    comments_count = Comment.objects.filter(user=user).count()
    likes_given_count = UserCurtesComment.objects.filter(user=user).count()

    # Annotate comments with likes_count
    user_comments = Comment.objects.filter(user=user).annotate(
        likes_count=Count('likes', distinct=True)
    ).order_by('-likes_count')

    # Serialize the user comments
    serialized_comments = CommentSerializer(user_comments, many=True)

    # Calculate likes received
    likes_received_count = sum(comment.likes_count for comment in user_comments)

    return Response({
        'evaluations_count': evaluations_count,
        'comments_count': comments_count,
        'likes_given_count': likes_given_count,
        'likes_received_count': likes_received_count,
        'user_comments': serialized_comments.data  # Add serialized comments
    })


def search(request):
    query = request.GET.get('q', '')
    if query:
        departments = Department.objects.filter(
            Q(department_code__icontains=query) | Q(department_name__icontains=query)
        ).values('id', 'department_code', 'department_name')

        disciplines = Discipline.objects.filter(
            Q(discipline_code__icontains=query) | Q(name__icontains=query)
        ).values('id', 'discipline_code', 'name')

        results = {
            'departments': list(departments),
            'disciplines': list(disciplines),
        }
    else:
        results = {'departments': [], 'disciplines': []}

    return JsonResponse(results)
    
class UserCreateView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuário criado com sucesso!"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class UserRegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuário registrado com sucesso!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
def discipline_details(request, discipline_id):
    try:
        discipline = Discipline.objects.get(id=discipline_id)
        
        evaluations = UserTookDiscipline.objects.filter(discipline=discipline)
        
        averages_by_year = evaluations.values('semester_completed').annotate(
            avg_teaching=Avg('note_teaching'),
            avg_material=Avg('note_material'),
            avg_difficulty=Avg('note_difficulty'),
            avg_general=(Avg('note_teaching') + Avg('note_material') - Avg('note_difficulty') + 10)
        )
        
        response_data = {
            "discipline_code": discipline.discipline_code,
            "name": discipline.name,
            "averages": list(averages_by_year),
        }
        return JsonResponse(response_data, safe=False)

    except Discipline.DoesNotExist:
        return JsonResponse({"error": "Disciplina não encontrada."}, status=404)