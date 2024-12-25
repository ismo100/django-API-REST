from django.shortcuts import redirect, render
from .models import ActivityData, Users
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from .serializers import UserSerializers, ActivityDataSerializers, defaultUsreSerializers
from django.contrib.auth.hashers import make_password, check_password
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
import json
from django.contrib.auth.models import User


@api_view(['GET'])
def get_users (request):
    users = Users.objects.all()
    users_serializers = UserSerializers(users, many=True)
    return Response (users_serializers.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_user (request):
    data = request.data
    user = Users(firstname=data["firstname"].lower(), lastname=data["lastname"].lower(), email=data["email"].lower(), dob=data["dob"], address=data["address"], password=make_password(data["password"]), confirmedpass=make_password(data["confirmedpass"]))
    user.save()
    user_auth = User(username=data["email"], password=data["password"])
    user_auth.set_password(data["password"])
    user_auth.save()
    token = Token.objects.create(user=user_auth)
    user_email = Users.objects.filter(email=data["email"]).first()
    if user_email:
        message = f"Un utilisateur avec email {data["email"]} existe déjà."
    return Response (UserSerializers(user).data, status=status.HTTP_201_CREATED)

    # serializer_data = UserSerializers(data=user)
    # if serializer_data.is_valid():
    #     serializer_data.save()
    #     return Response(serializer_data.data, status=status.HTTP_201_CREATED)
    # return Response(serializer_data.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def getToken (request):
    data = request.data
    user = User.objects.get(username=data["email"])
    token = Token.objects.get(user=user)
    return Response ({"username":user.username, "token" : token.key})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sign_in (request):
    data = request.data
    user = User.objects.get(username=data["email"])
    if user:
        auth_user = authenticate(username=data["email"], password=data["password"])
        if auth_user:
            return Response("Connexion réussie !!",status=status.HTTP_200_OK)
        else:
            message = "Mot de passe incorrect"
            return Response (message, status=status.HTTP_401_UNAUTHORIZED)
    else:
        message = "Email ou mot de passe incorrect"
    return Response (message, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def createActivity (request):
    data = request.data
    serializer_data = ActivityDataSerializers(data=data)
    if serializer_data.is_valid():
        serializer_data.save()
        return Response(serializer_data.data, status=status.HTTP_201_CREATED)
    return Response(serializer_data.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def get_activities (request):
    data = request.data
    activities = ActivityData.objects.filter(email=data["email"])
    serializers = ActivityDataSerializers(activities, many=True)
    return Response (serializers.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_all_activities (request):
    activities = ActivityData.objects.all()
    activities_serializers = ActivityDataSerializers(activities, many=True)
    return Response (activities_serializers.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
def update_user(request, pk):
    try:
        user = Users.objects.get(pk=pk)
    except Users.DoesNotExist:
        return Response (status=status.HTTP_404_NOT_FOUND)
    if request.method == 'PUT':
        data = request.data
        serializer = UserSerializers(user, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response (serializer.data, status=status.HTTP_201_CREATED)
        return Response (serializer.errors, status=status.HTTP_400_BAD_REQUEST)
