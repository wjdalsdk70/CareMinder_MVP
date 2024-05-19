from flask import Flask, request, jsonify
import torch
from transformers import BertTokenizer, BertForSequenceClassification
import stanza
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=3)
model.load_state_dict(torch.load('trained_model.pth'))
model.eval()  

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

stanza.download('ko')
nlp = stanza.Pipeline(lang='ko', processors='tokenize,pos,lemma,depparse', endpoint='http://localhost:9000')

@app.route('/classify', methods=['POST'])
def classify_request():
    # JSON 요청을 받아오기
    data = request.get_json()
    text = data['text']
    doc = nlp(text)
    requests = [sentence.text for sentence in doc.sentences]
    classifications = []

    for request_text in requests:
        inputs = tokenizer(request_text, return_tensors="pt", padding=True, truncation=True, max_length=512)
        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = model(**inputs)
            predictions = torch.argmax(outputs.logits, dim=1)
        classifications.append({'request': request_text, 'prediction': predictions.item()})

    return jsonify(classifications)

if __name__ == '__main__':
    app.run(debug=True)