from django.urls import include, path
from . import views

urlpatterns = [
    path("", views.RequestListCreateView.as_view(), name="request-list"),
    path(
        "<int:pk>/",
        views.RequestRetrieveUpdateDestroyView.as_view(),
        name="request-detail",
    ),
    path("", views.RequestListCreateView.as_view(), name="request-list"),
    path(
        "<int:pk>/",
        views.RequestRetrieveUpdateDestroyView.as_view(),
        name="request-detail",
    ),
    path(
        "<int:request_pk>/chat_messages/",
        views.ChatMessageListCreateView.as_view(),
        name="chat-list",
    ),
    path(
        "<int:request_pk>/chat_messages/<int:pk>/",
        views.ChatMessageRetrieveUpdateDestroyView.as_view(),
        name="examination-detail",
    ),
]
