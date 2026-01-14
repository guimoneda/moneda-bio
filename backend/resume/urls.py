from django.urls import path
from .views import JobList, EducationList, CertificationList

urlpatterns = [
    path('jobs/', JobList.as_view(), name='job-list'),
    path('education/', EducationList.as_view(), name='education-list'),
    path('certifications/', CertificationList.as_view(), name='certification-list'),
    
]