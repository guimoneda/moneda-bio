from rest_framework import serializers
from .models import Job, Education

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'company', 'title', 'start_date', 'end_date', 'description', 'technologies', 'image', 'image_url', 'is_current']


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['degree', 'institution', 'start_date', 'end_date', 'is_active']