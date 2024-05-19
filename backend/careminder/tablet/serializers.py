from rest_framework import serializers
from patient.models import Patient

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from patient.serializers import PatientSerializer
from settings.models import Area
from settings.serializers import AreaSerializer
from staff.models import Staff
from staff.serializers import StaffSerializer
from rest_framework import exceptions

from .models import Tablet


class TabletSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=Patient.objects.all(),
        source="patient",
        required=False,
    )
    area_id = serializers.PrimaryKeyRelatedField(
        queryset=Area.objects.all(),
        source="area",
        required=False,
    )

    class Meta:
        model = Tablet
        fields = [
            "id",
            "name",
            "patient_id",
            "area_id",
        ]
