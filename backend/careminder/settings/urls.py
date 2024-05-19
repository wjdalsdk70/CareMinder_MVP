from django.urls import include, path
from . import views

urlpatterns = [
    path("", views.SettingsRetrieveUpdateView.as_view(), name="settings-detail"),
    path(
        "areas/",
        views.AreaListCreateView.as_view(),
        name="area-list",
    ),
    path(
        "areas/<int:pk>/",
        views.AreaRetrieveUpdateDestroyView.as_view(),
        name="area-detail",
    ),
]
