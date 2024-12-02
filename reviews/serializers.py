from rest_framework import serializers
from .models import User, UserTookDiscipline

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'nusp', 'fullname', 'username', 'email', 'password', 'confirm_password', 
                  'course', 'start_date', 'user_photo', 'is_staff', 'is_superuser']

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            nusp=validated_data['nusp'],
            fullname=validated_data['fullname'],
            course=validated_data['course'],
            start_date=validated_data['start_date'],
            user_photo=validated_data.get('user_photo', None)  
        )
        return user

    def validate(self, data):

        required_fields = ['fullname', 'username', 'email', 'password', 'confirm_password', 'course', 'start_date']
        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({field: "Este campo é obrigatório."})

        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "As senhas não coincidem."})

        return data

class UserTookDisciplineSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTookDiscipline
        fields = ['user', 'discipline', 'semester_completed', 'note_teaching', 'note_material', 'note_difficulty']