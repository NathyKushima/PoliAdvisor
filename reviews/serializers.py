from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'nusp', 'fullname', 'username', 'emailUSP', 'password', 'confirm_password', 
                  'course', 'start_date', 'user_photo', 'status_user']
        
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

