from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if user.is_active:
                    data['user'] = user
                    return data
                raise serializers.ValidationError("İstifadəçi aktiv deyil")
            raise serializers.ValidationError("Yanlış istifadəçi adı və ya şifrə")
        raise serializers.ValidationError("İstifadəçi adı və şifrə tələb olunur")
