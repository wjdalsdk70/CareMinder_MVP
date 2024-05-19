from rest_framework import generics
from django.http import Http404
from careminder.permissions import CustomDjangoModelPermissions
from .models import Settings, Area
from .serializers import SettingsSerializer, AreaSerializer


class SettingsRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Settings.objects.all()
    serializer_class = SettingsSerializer

    def get_object(self):
        settings = Settings.objects.first()
        if settings is None:
            settings = Settings.objects.create()
        return settings


class AreaListCreateView(generics.ListCreateAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Area.objects.all()
    serializer_class = AreaSerializer


class AreaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
