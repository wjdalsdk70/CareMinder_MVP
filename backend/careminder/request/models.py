from http.client import PROCESSING
from urllib import request

from django.db import models
from patient.models import Patient
from staff.models import Staff

from tablet.models import Tablet


class Request(models.Model):
    class State(models.IntegerChoices):
        WAITING = 0, "Waiting"
        PROCESSING = 1, "Processing"
        FINISHED = 2, "Finished"

    text = models.TextField()
    recording = models.BinaryField(null=True)
    for_type = models.PositiveSmallIntegerField(choices=Staff.Type.choices, null=True)
    is_question = models.BooleanField()
    state = models.PositiveSmallIntegerField(
        choices=State.choices, default=State.WAITING
    )
    time = models.DateTimeField(auto_now_add=True)
    response = models.TextField(null=True, blank=True)
    response_time = models.DateTimeField(null=True)
    tablet = models.ForeignKey(
        Tablet, on_delete=models.SET_NULL, null=True
    )  # TODO: fix request history on patient change problem
    staff = models.ForeignKey(
        Staff, related_name="staff_requests", on_delete=models.SET_NULL, null=True
    )


class ChatMessage(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE)
    text = models.TextField()
    time = models.DateTimeField(auto_now_add=True)
    from_patient = models.BooleanField()
