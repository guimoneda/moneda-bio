from django.contrib import admin
from .models import Job, Education

@admin.register(Job)
@admin.site.register(Education)

class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'start_date', 'image', 'technologies', 'is_current')
    search_fields = ('title', 'company','technologies')