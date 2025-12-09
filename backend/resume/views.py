#from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import Job
from .serializers import JobSerializer

class JobList(generics.ListAPIView):
    # Get all jobs, sorted by start date (defined in model)
    queryset = Job.objects.all()
    serializer_class = JobSerializer