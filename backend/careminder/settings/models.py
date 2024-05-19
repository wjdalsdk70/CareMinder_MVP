from django.db import models


# Create your models here.
class Settings(models.Model):
    hospital_title = models.CharField(max_length=100, null=True, blank=True)
    hospital_description = models.CharField(max_length=255, null=True, blank=True)
    notification = models.CharField(max_length=255, null=True, blank=True)
    use_nfc = models.BooleanField(default=False)


class Area(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
