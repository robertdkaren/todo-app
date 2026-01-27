from django.contrib.auth import authenticate, login, logout
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Todo, UserPreferences
from .serializers import TodoSerializer, UserPreferencesSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return Response({'username': user.username})
    else:
        return Response(
            {'error': 'Invalid credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    return Response({'username': request.user.username})


class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        max_position = Todo.objects.filter(user=self.request.user).count()
        serializer.save(user=self.request.user, position=max_position)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reorder_todos_view(request):
    todo_ids = request.data.get('order', [])
    if not isinstance(todo_ids, list):
        return Response({'error': 'order must be a list'}, status=status.HTTP_400_BAD_REQUEST)

    user_todos = Todo.objects.filter(user=request.user)
    user_todo_ids = set(user_todos.values_list('id', flat=True))

    if set(todo_ids) != user_todo_ids:
        return Response({'error': 'Invalid todo IDs'}, status=status.HTTP_400_BAD_REQUEST)

    for position, todo_id in enumerate(todo_ids):
        Todo.objects.filter(id=todo_id, user=request.user).update(position=position)

    return Response({'message': 'Reordered successfully'})


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def preferences_view(request):
    preferences, created = UserPreferences.objects.get_or_create(
        user=request.user,
        defaults={'field_order': ['title', 'custom_field_type', 'custom_field_value']}
    )

    if request.method == 'GET':
        serializer = UserPreferencesSerializer(preferences)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserPreferencesSerializer(preferences, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
