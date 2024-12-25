from rest_framework import serializers
from .models import Users, ActivityData
from django.contrib.auth.models import User

class UserSerializers (serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'

class ActivityDataSerializers (serializers.ModelSerializer):
    class Meta:
        model = ActivityData
        fields = '__all__'

class defaultUsreSerializers  (serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'