import json
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Avg, Count, Func, F, IntegerField
from .models import User, Department, Discipline, UserTookDiscipline
from .serializers import UserSerializer, DisciplineSerializer

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

@api_view(['GET'])
@login_required
def get_user_info(request):
    user = request.user
    user_data = User.objects.get(id=user.id)

    return Response({
        'username': user_data.username,
        'fullname': user_data.fullname,
        'photo': user_data.user_photo.url if user_data.user_photo else None,
        'initials': user_data.initials() 
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
    
class DisciplineDetailView(APIView):
    def get(self, request, discipline_id):
        try:
            discipline = Discipline.objects.get(id=discipline_id)
            serializer = DisciplineSerializer(discipline)
            return Response(serializer.data)
        except Discipline.DoesNotExist:
            return Response({'error': 'Discipline not found'}, status=404)
        
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            # Log the user in (this will create a session for the user)
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)