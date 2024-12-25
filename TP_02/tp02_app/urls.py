from django.urls import path
from .views import get_users,create_user,createActivity,sign_in,get_activities,get_all_activities,update_user,getToken


urlpatterns = [
    path('users/', get_users, name='get_users'),
    path('register/', create_user, name='create_user'),
    path('sign_in/', sign_in, name='sign_in'),
    path('createActivity/', createActivity, name='create_Activity'), 
    path('get_activities/', get_activities, name='get_activities'),  
    path('get_all_activities/', get_all_activities, name='get_all_activities'),
    path('user/<str:pk>', update_user, name='update_user'),
    path('get_token/', getToken, name='getToken'),
]