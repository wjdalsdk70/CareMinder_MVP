from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password
from rest_framework import generics, status
from rest_framework.response import Response

from careminder.permissions import CustomDjangoModelPermissions
from staff.permissions import (
    IsUserOrHasCustomModelPermissions,
)
from .models import Staff
from .serializers import StaffSerializer


class StaffListCreateView(generics.ListCreateAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer


class StaffRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [
        IsUserOrHasCustomModelPermissions,
    ]
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
