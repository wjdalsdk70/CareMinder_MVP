import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from .serializers import ChatMessageSerializer, RequestSerializer
from careminder.permissions import CustomDjangoModelPermissions
from .models import Request, ChatMessage
from staff.models import Staff
from tablet.models import Tablet
from settings.models import Area


# Create your views here.


class RequestFilter(django_filters.FilterSet):
    for_type = django_filters.MultipleChoiceFilter(choices=Staff.Type.choices)
    is_question = django_filters.MultipleChoiceFilter(
        choices=[(1, "true"), (0, "false")]
    )
    state = django_filters.MultipleChoiceFilter(choices=Request.State.choices)
    tablet = django_filters.ModelMultipleChoiceFilter(queryset=Tablet.objects.all())
    staff = django_filters.ModelMultipleChoiceFilter(
        queryset=Staff.objects.all(), null_label="null"
    )
    staff__type = django_filters.MultipleChoiceFilter(choices=Staff.Type.choices)
    tablet__area = django_filters.ModelMultipleChoiceFilter(
        field_name="tablet__area", queryset=Area.objects.all()
    )

    class Meta:
        model = Request
        fields = [
            "for_type",
            "is_question",
            "state",
            "tablet",
            "staff",
            "staff__type",
            "tablet__area",
        ]


class RequestListCreateView(generics.ListCreateAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = RequestFilter


class RequestRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = Request.objects.all()
    serializer_class = RequestSerializer


class ChatMessageListCreateView(generics.ListCreateAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer

    def get_queryset(self):
        request_id = self.kwargs["request_pk"]
        return ChatMessage.objects.filter(request__id=request_id)

    def perform_create(self, serializer):
        request = Request.objects.get(pk=self.kwargs["request_pk"])
        serializer.save(request=request)


class ChatMessageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [CustomDjangoModelPermissions]
    queryset = ChatMessage.objects.all()
    serializer_class = RequestSerializer

    def get_queryset(self):
        request_id = self.kwargs["request_pk"]
        return ChatMessage.objects.filter(request__id=request_id)
