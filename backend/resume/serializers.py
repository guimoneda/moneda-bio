from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'company', 'title', 'start_date', 'end_date', 'description', 'is_current']