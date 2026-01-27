from rest_framework import serializers
from .models import Todo, UserPreferences


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'title', 'custom_field_type', 'custom_field_value', 'position']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title is required.")
        return value.strip()

    def validate(self, data):
        field_type = data.get('custom_field_type')
        field_value = data.get('custom_field_value')

        if field_type == 'string':
            if not isinstance(field_value, str) or not field_value.strip():
                raise serializers.ValidationError({
                    'custom_field_value': 'Must be a non-empty string.'
                })
        elif field_type == 'boolean':
            if not isinstance(field_value, bool):
                raise serializers.ValidationError({
                    'custom_field_value': 'Must be a boolean (true or false).'
                })
        elif field_type == 'number':
            if not isinstance(field_value, (int, float)) or isinstance(field_value, bool):
                raise serializers.ValidationError({
                    'custom_field_value': 'Must be a number.'
                })

        return data


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = ['field_order']

    def validate_field_order(self, value):
        valid_fields = {'title', 'custom_field_type', 'custom_field_value'}
        if not isinstance(value, list):
            raise serializers.ValidationError("Field order must be a list.")
        if set(value) != valid_fields:
            raise serializers.ValidationError(
                f"Field order must contain exactly: {', '.join(valid_fields)}"
            )
        return value
