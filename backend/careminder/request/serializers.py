from rest_framework import serializers
from staff.models import Staff
from settings.serializers import AreaSerializer
from tablet.models import Tablet
from .models import ChatMessage, Request
from django.db.models import Q


class RequestSerializer(serializers.ModelSerializer):
    tablet_id = serializers.PrimaryKeyRelatedField(
        queryset=Tablet.objects.all(),
        source="tablet",
    )
    area = AreaSerializer(read_only=True, source="tablet.area")

    staff_id = serializers.PrimaryKeyRelatedField(
        queryset=Staff.objects.all(),
        source="staff",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Request
        fields = [
            "id",
            "text",
            "recording",
            "for_type",
            "is_question",
            "state",
            "time",
            "response",
            "response_time",
            "tablet_id",
            "staff_id",
            "area",
        ]


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = [
            "id",
            "text",
            "time",
            "from_patient",
        ]
