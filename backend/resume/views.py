#from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Job, Education, Certification
from .serializers import JobSerializer, EducationSerializer, CertificationSerializer

class JobList(generics.ListAPIView):
    # Get all jobs, sorted by start date (defined in model)
    queryset = Job.objects.all()
    serializer_class = JobSerializer

class EducationList(generics.ListAPIView):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

class CertificationList(generics.ListAPIView):
    queryset = Certification.objects.all().order_by('-issue_date')
    serializer_class = CertificationSerializer