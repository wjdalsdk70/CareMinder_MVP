from django.urls import include, path
from . import views

urlpatterns = [
    path("", views.TabletListCreateView.as_view(), name="tablet-list"),
    path(
        "<int:pk>/",
        views.TabletRetrieveUpdateDestroyView.as_view(),
        name="tablet-detail",
    ),
]
