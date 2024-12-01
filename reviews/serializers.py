from rest_framework import serializers
from django.db.models import Avg, Count
from django.contrib.auth.hashers import make_password
from .models import User, Discipline, UserTookDiscipline

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'nusp', 'fullname', 'username', 'emailUSP', 'password', 'confirm_password', 
                  'cours', 'start_date', 'user_photo', 'status_user']
        
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        validated_data['hashed_password'] = make_password(validated_data.pop('password'))
        validated_data['status_user'] = validated_data.get('status_user', 1)
        return User.objects.create(**validated_data)

    def validate(self, data):
        required_fields = ['fullname', 'username', 'emailUSP', 'password', 'confirm_password', 'course', 'start_date']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo é obrigatório."})

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