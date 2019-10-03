from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User
from .models import *


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    username = serializers.CharField(
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    password = serializers.CharField(min_length=8, write_only=True)

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], validated_data['email'],
             validated_data['password'])
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')


class UserDetailsSerializer(serializers.ModelSerializer):
    # def create(self, validated_data):
    #     user = User.objects.create_user(validated_data['name'], validated_data['age'],
    #          validated_data['gender'], validated_data['bio'], validated_data['images'], validated_data['last_login'])
    #     return users

    class Meta:
        model = UserDetials
        fields = ('name', 'age', 'gender', 'bio', 'images', 'last_login')


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = ('prefer_gender', 'min_age', 'max_age', 'min_distance', 'max_distance')


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('location_x', 'location_y', 'zone')


class UserConnectionsSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserConnections
        fields = ('user_id', 'connected_user_id')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = ('user_id', 'notification', 'not_id')


class UserInfoMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInfoMapping
        fields = ('user_id','user_details_id', 'user_preferences_id', 'user_location_id', 'user_connections_id', 'notification_id')
        