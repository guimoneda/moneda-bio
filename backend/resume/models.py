from django.db import models
from django.contrib.postgres.fields import ArrayField

class Job(models.Model):
    company = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True) # Null means "Present"
    description = models.TextField()
    is_current = models.BooleanField(default=False)
    technologies = ArrayField(
        models.CharField(max_length=20, blank=True),
        blank=True,
        default=list
    )
    
    # This makes it sort automatically by newest first
    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.title} at {self.company}"