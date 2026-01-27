from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'todos', views.TodoViewSet, basename='todo')

urlpatterns = [
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/me/', views.me_view, name='me'),
    path('preferences/', views.preferences_view, name='preferences'),
    path('todos/reorder/', views.reorder_todos_view, name='reorder-todos'),
    path('', include(router.urls)),
]
