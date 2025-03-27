from django.contrib.auth import get_user_model
from django.contrib.auth import login, logout
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, LoginSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        # Qeydiyyatdan keçən istifadəçi üçün avtomatik token yaradırıq
        Token.objects.create(user=user)
        return user


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)  # Django session login
            
            # Tokeni alırıq və ya yenisini yaradırıq
            token, created = Token.objects.get_or_create(user=user)
            
            response_data = {
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'message': 'Uğurlu giriş'
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        # Tokeni silirik (əgər istifadə edirsinizsə)
        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()
        
        logout(request)  # Django session logout
        return Response({"message": "Uğurlu çıxış"}, status=status.HTTP_200_OK)