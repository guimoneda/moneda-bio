from django.contrib import admin
from .models import Job

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'start_date', 'technologies', 'is_current')
    search_fields = ('title', 'company','technologies')