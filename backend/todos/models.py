from django.db import models
from django.contrib.auth.models import User


class Todo(models.Model):
    FIELD_TYPE_CHOICES = [
        ('string', 'String'),
        ('boolean', 'Boolean'),
        ('number', 'Number'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')
    title = models.CharField(max_length=255)
    custom_field_type = models.CharField(max_length=10, choices=FIELD_TYPE_CHOICES)
    custom_field_value = models.JSONField()
    position = models.IntegerField(default=0)

    class Meta:
        ordering = ['position', 'id']

    def __str__(self):
        return self.title


class UserPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    field_order = models.JSONField(default=list)

    def __str__(self):
        return f"Preferences for {self.user.username}"
