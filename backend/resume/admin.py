from django.contrib import admin
from .models import Job, Education

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'start_date', 'image', 'technologies', 'is_current')
    search_fields = ('title', 'company','technologies')

@admin.site.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'start_date', 'end_date', 'is_active')
    search_fields = ('degree', 'institution')
