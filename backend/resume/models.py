from django.db import models
from django.contrib.postgres.fields import ArrayField
from ckeditor.fields import RichTextField

class Job(models.Model):
    company = models.CharField(max_length=200)
    title = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True) # Null means "Present"
    description = RichTextField()
    is_current = models.BooleanField(default=False)
    image = models.ImageField(upload_to='jobs/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    technologies = ArrayField(
        models.CharField(max_length=30, blank=True),
        blank=True,
        default=list
    )
    
class Education(models.Model):
    institution = models.CharField(max_length=200) # e.g., "Harvard University"
    degree = models.CharField(max_length=200)      # e.g., "B.Sc. Computer Science"
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True) # Blank = "Present"
    description = RichTextField(blank=True)
    is_active = models.BooleanField(default=False)

    
     # This makes it sort automatically by newest first
    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.title} at {self.company}"

    
    def __str__(self):
        return f"{self.degree} at {self.institution}"

class Certification(models.Model):
    name = models.CharField(max_length=200) # e.g. "CompTIA A+"
    issuing_organization = models.CharField(max_length=200) # e.g. "CompTIA"
    issue_date = models.DateField()
    expiration_date = models.DateField(null=True, blank=True)
    credential_url = models.URLField(blank=True, null=True) # Link to verify
    is_active = models.BooleanField(default=False) # Check this if it never expires or is your main focus
    description = RichTextField(blank=True, null=True)

    def __str__(self):
        return self.name