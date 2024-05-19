from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Group
from staff.models import Staff
from getpass import getpass


class Command(BaseCommand):
    help = 'Create a new user with the role "Patient"'

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            type=str,
            help="The username of the new user",
            nargs="?",
            default=None,
        )
        parser.add_argument(
            "--password",
            type=str,
            help="The password of the new user",
            nargs="?",
            default=None,
        )

    def handle(self, *args, **kwargs):
        username = kwargs["username"]
        password = kwargs["password"]

        if username is None:
            username = input("Username: ")
        if password is None:
            while True:
                password = getpass("Password: ")
                confirm_password = getpass("Password (again): ")
                if password == confirm_password:
                    break
                print("Passwords do not match. Please try again.")

        if Staff.objects.filter(username=username).exists():
            raise CommandError('User "%s" already exists' % username)

        user = Staff.objects.create(
            username=username,
            password=make_password(password),
            role=Staff.Role.PATIENT,
        )

        group_name = Staff.Role.choices[Staff.Role.PATIENT][1].upper()
        group = Group.objects.get(name=group_name)
        user.groups.add(group)

        self.stdout.write(
            self.style.SUCCESS('Successfully created user "%s"' % username)
        )
