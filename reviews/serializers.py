from rest_framework import serializers
from django.db.models import Avg, Count
from django.contrib.auth.hashers import make_password
from .models import User, Discipline, UserTookDiscipline

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'nusp', 'fullname', 'username', 'email', 'password', 'confirm_password', 
                  'course', 'start_date', 'user_photo', 'is_staff', 'is_superuser']

    def create(self, validated_data):
        # Remove the confirm_password from the validated data as it's not a model field
        validated_data.pop('confirm_password', None)

        # Hash the password using Django's set_password method (more secure and consistent)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            nusp=validated_data['nusp'],
            fullname=validated_data['fullname'],
            course=validated_data['course'],
            start_date=validated_data['start_date'],
            user_photo=validated_data.get('user_photo', None)  # Handle user_photo, if provided
        )
        return user

    def validate(self, data):
        # Check if all required fields are present
        required_fields = ['fullname', 'username', 'email', 'password', 'confirm_password', 'course', 'start_date']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo é obrigatório."})

        # Ensure passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "As senhas não coincidem."})

        return data
    
class DisciplineSerializer(serializers.ModelSerializer):
    avg_teaching = serializers.SerializerMethodField()
    avg_material = serializers.SerializerMethodField()
    avg_difficulty = serializers.SerializerMethodField()
    avg_overall = serializers.SerializerMethodField()

    class Meta:
        model = Discipline
        fields = ['id', 'discipline_code', 'name', 'avg_teaching', 'avg_material', 'avg_difficulty', 'avg_overall']

    def get_avg_teaching(self, obj):
        return UserTookDiscipline.objects.filter(discipline=obj, semester_completed=2024).aggregate(
            Avg('note_teaching')
        )['note_teaching__avg'] or 0

    def get_avg_material(self, obj):
        return UserTookDiscipline.objects.filter(discipline=obj, semester_completed=2024).aggregate(
            Avg('note_material')
        )['note_material__avg'] or 0

    def get_avg_difficulty(self, obj):
        return UserTookDiscipline.objects.filter(discipline=obj, semester_completed=2024).aggregate(
            Avg('note_difficulty')
        )['note_difficulty__avg'] or 0

    def get_avg_overall(self, obj):
        avg_teaching = self.get_avg_teaching(obj)
        avg_material = self.get_avg_material(obj)
        avg_difficulty = self.get_avg_difficulty(obj)
        return avg_teaching + avg_material + avg_difficulty - 10