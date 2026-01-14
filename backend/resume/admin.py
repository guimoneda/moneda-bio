from django.contrib import admin
from .models import Job, Education, Certification

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

# 3. Configuration for CERTIFICATIONS
@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('name', 'issuing_organization', 'issue_date', 'is_active')
    search_fields = ('name', 'issuing_organization')
    list_filter = ('is_active', 'issuing_organization')
    date_hierarchy = 'issue_date'