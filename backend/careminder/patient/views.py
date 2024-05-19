from rest_framework import generics
from careminder.permissions import CustomDjangoModelPermissions
from .models import Patient
from .serializers import PatientSerializer


class PatientListCreateView(generics.ListCreateAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class PatientRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
