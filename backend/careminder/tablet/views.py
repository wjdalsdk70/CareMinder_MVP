from rest_framework import generics
from rest_framework.permissions import AllowAny
from careminder.permissions import CustomDjangoModelPermissions
from tablet.serializers import TabletSerializer
from .models import Tablet


class TabletListCreateView(generics.ListCreateAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Tablet.objects.all()
    serializer_class = TabletSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return super().get_permissions()


class TabletRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Tablet.objects.all()
    serializer_class = TabletSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return super().get_permissions()
