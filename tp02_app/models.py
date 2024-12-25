from django.db import models

# Create your models here.

class Users(models.Model):
    firstname = models.CharField(max_length=32, null=False, blank=False)
    lastname = models.CharField(max_length=32, null=False, blank=False)
    email = models.EmailField(max_length=128, unique=True, null=False, blank=False, primary_key=True)
    dob = models.DateField(blank=False, null=False)
    address = models.CharField(max_length=6, blank=False, null=False)
    password = models.CharField(max_length=128, null=False, blank=False)
    confirmedpass = models.CharField(max_length=128, null=False, blank=False)

class ActivityData(models.Model):
    email = models.EmailField(max_length=128)
    uri = models.CharField(max_length=1024, blank=True)
    coords = models.CharField(max_length=2048, null=True)
    location = models.CharField(max_length=512)
    date = models.DateField(blank=False, null=False)
    sentier = models.CharField(max_length=512, blank=True)