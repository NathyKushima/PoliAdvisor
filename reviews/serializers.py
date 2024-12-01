from rest_framework import serializers
from .models import User

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

