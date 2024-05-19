from django.urls import re_path
from .consumers import SpeechToTextConsumer

websocket_urlpatterns = [
    re_path(r'ws/speech-to-text/$', SpeechToTextConsumer.as_asgi()),
]
