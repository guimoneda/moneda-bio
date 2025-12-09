from django.urls import path
from .views import JobList

urlpatterns = [
    path('jobs/', JobList.as_view(), name='job-list'),
]