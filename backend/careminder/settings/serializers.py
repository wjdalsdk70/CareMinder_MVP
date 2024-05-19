from os import read
from rest_framework import serializers
from tablet.models import Tablet
from .models import Area, Settings


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = [
            "hospital_title",
            "hospital_description",
            "notification",
            "use_nfc",
        ]


class AreaSerializer(serializers.ModelSerializer):
    tablet_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        write_only=True,
        queryset=Tablet.objects.all(),
        required=False,
    )

    class Meta:
        model = Area
        fields = [
            "id",
            "name",
            "tablet_ids",
        ]

    def validate_tablets_id(self, value):
        tablet_ids = [tablet.id for tablet in value]
        if not Tablet.objects.filter(id__in=tablet_ids).count() == len(tablet_ids):
            raise serializers.ValidationError("One or more tablet IDs do not exist.")
        return value

    def assign_tablets_to_area(self, area, tablets):
        for tablet in tablets:
            tablet.area = area
            tablet.save()

    def create(self, validated_data):
        tablets = validated_data.pop("tablet_ids", [])
        area = Area.objects.create(**validated_data)
        self.assign_tablets_to_area(area, tablets)
        return area

    def update(self, instance, validated_data):
        tablets = validated_data.pop("tablets_ids", [])
        instance.name = validated_data.get("name", instance.name)
        instance.save()
        self.assign_tablets_to_area(instance, tablets)
        return instance
