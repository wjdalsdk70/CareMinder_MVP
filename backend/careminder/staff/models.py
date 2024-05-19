from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password


class Staff(AbstractUser):
    class Role(models.IntegerChoices):
        CAREWORKER = (
            0,
            "Careworker",
        )
        PATIENT = (
            1,
            "Patient",
        )

    class Type(models.IntegerChoices):
        HELPER = 0, "Helper"
        NURSE = 1, "Nurse"
        DOCTOR = 2, "Doctor"

    nfc = models.CharField(null=True, max_length=256)
    role = models.PositiveSmallIntegerField(null=True, choices=Role.choices)
    type = models.PositiveSmallIntegerField(null=True, choices=Type.choices)

    USERNAME_FIELD = "username"

    def set_nfc(self, nfc: str):
        self.nfc = make_password(nfc)

    def check_nfc(self, nfc):
        if self.nfc is None:
            return False
        return check_password(nfc, self.nfc)
