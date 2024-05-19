from django.contrib.auth.models import Group
from rest_framework import serializers

from staff.models import Staff


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = [
            "id",
            "username",
            "password",
            "nfc",
            "first_name",
            "last_name",
            "role",
            "type",
        ]
        extra_kwargs = {
            "password": {
                "write_only": True,
            },
            "nfc": {
                "write_only": True,
            },
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        nfc = validated_data.pop("nfc")
        user = Staff(**validated_data)
        user.set_password(password)
        user.set_nfc(nfc)
        user.save()

        role = validated_data.get("role")
        if role is not None:
            group_name = Staff.Role.choices[role][1].upper()
            group, created = Group.objects.get_or_create(name=group_name)
            user.groups.add(group)

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        nfc = validated_data.pop("nfc", None)

        if password is not None:
            instance.set_password(password)
        if nfc is not None:
            instance.set_nfc(nfc)

        super().update(instance, validated_data)

        role = validated_data.get("role")
        if role is not None:
            group_name = Staff.Role.choices[role][1].upper()
            group = Group.objects.get(name=group_name)
            instance.groups.clear()
            instance.groups.add(group)
            instance.save()

        return instancegi
