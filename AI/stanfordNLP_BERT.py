import pandas as pd
import torch
from torch.utils.data import DataLoader, Dataset
from transformers import BertTokenizer, BertForSequenceClassification, AdamW
from sklearn.model_selection import train_test_split
import stanza
from tqdm import tqdm

class RequestDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts[idx]
        label = self.labels[idx]
        encoding = self.tokenizer.encode_plus(
            text,
            add_special_tokens=True,
            max_length=self.max_len,
            return_token_type_ids=False,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt',
        )

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }

df = pd.read_csv('request.csv')
texts = df['request'].tolist()
labels = df['label'].tolist()

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=3)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# 데이터 분할 및 데이터로더 설정
train_texts, val_texts, train_labels, val_labels = train_test_split(texts, labels, test_size=0.1)
train_dataset = RequestDataset(train_texts, train_labels, tokenizer)
val_dataset = RequestDataset(val_texts, val_labels, tokenizer)
train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=16)

optimizer = AdamW(model.parameters(), lr=5e-5)

def train_epoch(model, data_loader, optimizer, device):
    model.train()
    total_loss = 0
    total_correct = 0
    progress_bar = tqdm(data_loader, total=len(data_loader), desc="Training", unit="batch", leave=False)

    for data in progress_bar:
        input_ids = data['input_ids'].to(device)
        attention_mask = data['attention_mask'].to(device)
        labels = data['labels'].to(device)

        model.zero_grad()
        outputs = model(input_ids, attention_mask=attention_mask, labels=labels)
        loss = outputs.loss
        loss.backward()
        optimizer.step()

        logits = outputs.logits
        preds = torch.argmax(logits, dim=1)
        total_correct += torch.sum(preds == labels).item()
        total_loss += loss.item()

        progress_bar.set_description(f"Loss: {loss.item():.4f}")

    avg_loss = total_loss / len(data_loader)
    avg_accuracy = total_correct / len(data_loader.dataset)
    return avg_loss, avg_accuracy

for epoch in range(15):
    train_loss, train_accuracy = train_epoch(model, train_loader, optimizer, device)
    print(f'Epoch {epoch + 1}, Train Loss: {train_loss:.4f}, Accuracy: {train_accuracy:.4f}')

torch.save(model.state_dict(), 'trained_model.pth')