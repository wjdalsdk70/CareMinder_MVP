from django.urls import include, path
from . import views

urlpatterns = [
    path("", views.PatientListCreateView.as_view(), name="patient-list"),
    path(
        "<int:pk>/",
        views.PatientRetrieveUpdateDestroyView.as_view(),
        name="patient-detail",
    ),
]
