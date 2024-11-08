import os
from flask import Flask, request, jsonify
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model_path = os.getenv('MODEL_PATH', 'default_path')

tokenizer = BertTokenizer.from_pretrained('monologg/kobert')
model = BertForSequenceClassification.from_pretrained(model_path)
model.eval()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

@app.route('/onboard', methods=['POST'])
def classify_request():
    data = request.get_json()
    text = data['text']
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        predictions = torch.argmax(outputs.logits, dim=1)
    response = {'text': text, 'label': predictions.item()}

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
