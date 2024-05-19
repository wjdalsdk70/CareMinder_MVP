import requests
import pandas as pd

df = pd.read_csv('complex_request.csv')
url = 'http://localhost:5000/classify'

for index, row in df.iterrows():
    text = row['request']
    response = requests.post(url, json={"text": text})
    print(f"Request: {text}")
    try:
        print("Response:", response.json())
    except ValueError:
        print("Failed to decode JSON from response:", response.text)  # JSON 디코드 실패 시 메시지 출력
    print("-" * 50)