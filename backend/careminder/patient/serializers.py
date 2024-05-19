from rest_framework import serializers

from staff.models import Staff
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Staff.objects.filter(type=Staff.Type.DOCTOR),
        source="doctor",
        required=False,
    )

    class Meta:
        model = Patient
        fields = [
            "id",
            "first_name",
            "last_name",
            "age",
            "severity",
            "medical_progress",
            "doctor_id",
        ]
