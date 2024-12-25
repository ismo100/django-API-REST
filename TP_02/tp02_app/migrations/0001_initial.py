# Generated by Django 5.1.4 on 2024-12-19 16:24

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ActivityData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=128)),
                ('uri', models.CharField(blank=True, max_length=1024)),
                ('coords', models.CharField(max_length=2048, null=True)),
                ('location', models.CharField(max_length=512)),
                ('date', models.DateField()),
                ('sentier', models.CharField(blank=True, max_length=512)),
            ],
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('firstname', models.CharField(max_length=32)),
                ('lastname', models.CharField(max_length=32)),
                ('email', models.EmailField(max_length=128, primary_key=True, serialize=False, unique=True)),
                ('dob', models.DateField()),
                ('address', models.CharField(max_length=6)),
                ('password', models.CharField(max_length=128)),
                ('confirmedpass', models.CharField(max_length=128)),
            ],
        ),
    ]