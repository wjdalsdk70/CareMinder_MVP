from django.core.management.base import BaseCommand

GROUPS = {
    "CAREWORKER": [
        "add_staff",
        "view_staff",
        "change_staff",
        "delete_staff",
        "add_patient",
        "view_patient",
        "change_patient",
        "delete_patient",
        "add_tablet",
        "view_tablet",
        "change_tablet",
        "delete_tablet",
        "add_request",
        "view_request",
        "change_request",
        "delete_request",
        "view_settings",
        "change_settings",
        "add_area",
        "view_area",
        "change_area",
        "delete_area",
        "add_chatmessage",
        "view_chatmessage",
        "change_chatmessage",
        "delete_chatmessage",
    ],
    "PATIENT": [
        "view_patient",
        "view_request",
        "view_tablet",
        "add_request",
        "view_request",
        "change_request",
        "view_settings",
        "view_area",
        "add_chatmessage",
        "view_chatmessage",
    ],
}


class Command(BaseCommand):
    help = "Creates groups and assigns permissions"

    def handle(self, *args, **options):
        from django.contrib.auth.models import Group, Permission
        from django.core.exceptions import ObjectDoesNotExist

        for group_name, permissions in GROUPS.items():
            group, created = Group.objects.get_or_create(name=group_name)
            if created:
                group.permissions.clear()
            for perm in permissions:
                try:
                    perm = Permission.objects.get(
                        codename=perm,
                    )
                    group.permissions.add(perm)
                except Permission.DoesNotExist:
                    all_permissions = Permission.objects.values_list(
                        "codename", flat=True
                    )
                    raise ObjectDoesNotExist(
                        f"Permission {perm} does not exist.\nAvailable permissions are: {', '.join(all_permissions)}"
                    )

        self.stdout.write(
            self.style.SUCCESS("Successfully created groups and assigned permissions")
        )
