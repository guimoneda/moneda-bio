from rest_framework import serializers
from .models import Job, Education, Certification
from datetime import date
from dateutil.relativedelta import relativedelta

class JobSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ['id', 'company', 'title', 'start_date', 'end_date', 'description', 'technologies', 'image', 'image_url', 'is_current', 'duration']

    def get_duration(self, obj):
        start = obj.start_date
        # If no end_date, assume today (active job)
        end = obj.end_date if obj.end_date else date.today()

        # Calculate the difference
        diff = relativedelta(end, start)
        
        years = diff.years
        months = diff.months

        # logical formatting
        parts = []
        if years > 0:
            parts.append(f"{years} yr{'s' if years > 1 else ''}")
        if months > 0:
            parts.append(f"{months} mo{'s' if months > 1 else ''}")
            
        return ", ".join(parts) if parts else "Less than 1 mo"


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['degree', 'institution', 'start_date', 'end_date', 'is_active']

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'