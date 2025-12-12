from django.contrib import admin
from .models import Job, Education

# 1. Configuration for JOBS
@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    # Ensure all parentheses are closed properly here
    list_display = ('title', 'company', 'start_date', 'image', 'technologies')
    search_fields = ('title', 'company', 'technologies')

# 2. Configuration for EDUCATION
@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'start_date', 'end_date')
    search_fields = ('degree', 'institution')
