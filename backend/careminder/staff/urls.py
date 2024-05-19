from django.urls import include, path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)


urlpatterns = [
    path("", views.StaffListCreateView.as_view(), name="staff-list"),
    path(
        "<int:pk>/",
        views.StaffRetrieveUpdateDestroyView.as_view(),
        name="staff-detail",
    ),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
]
