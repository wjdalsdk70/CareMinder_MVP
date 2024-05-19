import uuid
from django.db import models

from patient.models import Patient
from settings.models import Area
from staff.models import Staff


class Tablet(models.Model):
    # uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)
    patient = models.ForeignKey(
        Patient, related_name="tablets", on_delete=models.SET_NULL, null=True
    )
    area = models.ForeignKey(
        Area, related_name="tablets", on_delete=models.SET_NULL, null=True
    )

    def __str__(self) -> str:
        return f"{self.name}"
