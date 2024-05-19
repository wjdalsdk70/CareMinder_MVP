import json
from channels.generic.websocket import AsyncWebsocketConsumer
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types

class SpeechToTextConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        if bytes_data:
            # 오디오 데이터를 텍스트로 변환
            transcript = await self.process_audio(bytes_data)
            await self.send(text_data=json.dumps({'transcript': "transcript"}))

    async def process_audio(self, audio_data):
        # Google Cloud Speech-to-Text API 클라이언트 초기화
        client = speech.SpeechClient()

        # 오디오 스트림을 위한 설정
        audio = types.RecognitionAudio(content=audio_data)
        config = types.RecognitionConfig(
            encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code='en-US'
        )

        # 비동기 요청을 실행
        response = client.recognize(config, audio)

        # 첫 번째 결과의 텍스트 반환
        for result in response.results:
            return result.alternatives[0].transcript

        return "No transcript available"

