from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework import status
from .serializers import *
from django.contrib.auth.models import User
from .permissions import IsOwner


class UserCreate(APIView):
    """ 
    Creates the user. 
    """
    permission_classes = [AllowAny]

    def post(self, request, format='json'):
        user_serializer = UserSerializer(data=request.data)
        if not user_serializer.is_valid():
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = user_serializer.save()
        token = Token.objects.create(user=user)
        json = user_serializer.data
        json['token'] = token.key

        # Adding user detials to the db
        user_details_serializer = UserDetailsSerializer(data={
            "name":"NA",
            "age":-1,
            "gender":"NA",
            "bio":"NA",
            "images":[""]
        })
        if not user_details_serializer.is_valid():
            return Response(user_details_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_details_serializer.save()
        print(user_details_serializer.data)
        json["userdetials"] = user_details_serializer.data

        # Adding user preference to the db
        user_preference_serializer = UserPreferencesSerializer(data={
            "prefer_gender":"NA",
            "min_age":18,
            "max_age":25,
            "min_distance":0,
            "max_distance":5
        })
        if not user_preference_serializer.is_valid():
            return Response(user_preference_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user_preference_serializer.save()
        json["userpreferences"] = user_preference_serializer.data

        # Adding location to the db
        location_serializer = LocationSerializer(data={
            "location_x":0,
            "location_y":0,
            "zone":0
        })
        if not location_serializer.is_valid():
            return Response(location_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        location_serializer.save()
        json["location"] = location_serializer.data

        # Adding user info mapping to the db
        user_info_mapping = UserInfoMappingSerializer(data={
            "user_id":user_serializer.data['id'],
            "user_details_id":user_details_serializer.data['id'],
            "user_preferences_id":user_preference_serializer.data['id'],
            "user_location_id":location_serializer.data['id'],
            # "user_connection_id":[""],
            # "notification_id":""
        })
        if not user_info_mapping.is_valid():
            return Response(user_info_mapping.errors, status=status.HTTP_400_BAD_REQUEST)
        user_info_mapping.save()
        json["userinfomapping"] = user_info_mapping.data
        
        return Response(json, status=status.HTTP_201_CREATED)


class UserLogin(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format='json'):
        username = request.data.get("username")
        password = request.data.get("password")
        if username is None or password is None:
            return Response({'error': 'Please provide both username and password'},
                            status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=username, password=password)
        if not user:
            return Response({'error': 'Invalid Credentials'},
                            status=status.HTTP_404_NOT_FOUND)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key},
                    status=status.HTTP_200_OK)


class UserLogout(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request, format=None):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class AuthenticatedView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request):
        print(request.user)
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# class UserDetialsView(APIView):
#     permission_classes = [IsAuthenticated]
    
#     def post(self, request, format=None):
#         serializer = UserDetailsSerializer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             if user:
#                 json = serializer.data
#                 return Response(json, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     def get(self, request, format=None):
#         serializer = UserDetailsSerializer(request.data)
#         return Response(serializer.data)
