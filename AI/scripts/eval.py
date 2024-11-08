import argparse
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from torch.utils.data import DataLoader, TensorDataset
from metrics import accuracy  
import numpy as np
import os

def load_data(file_path, tokenizer, max_length=128):
    sentences = []
    labels = []
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            sentence, label = line.strip().split("\t")
            sentences.append(sentence)
            labels.append(int(label))

    inputs = tokenizer(sentences, return_tensors="pt", padding=True, truncation=True, max_length=max_length)
    labels = torch.tensor(labels)
    return TensorDataset(inputs["input_ids"], inputs["attention_mask"], labels), sentences, labels

def evaluate(model, dataloader, sentences, true_labels, device, output_file):
    model.eval()
    predictions = []

    with open(output_file, "w", encoding="utf-8") as f_out:
        for i, batch in enumerate(dataloader):
            b_input_ids, b_input_mask, b_labels = [x.to(device) for x in batch]
            
            with torch.no_grad():
                outputs = model(b_input_ids, attention_mask=b_input_mask)
            
            logits = outputs.logits
            preds = torch.argmax(logits, dim=1).detach().cpu().numpy()
            
            predictions.extend(preds)
            
            for sentence, true_label, pred_label in zip(sentences[i*len(preds):(i+1)*len(preds)], true_labels[i*len(preds):(i+1)*len(preds)], preds):
                f_out.write(f"{sentence}\t{true_label}\t{pred_label}\n")

    return accuracy(np.array(predictions), np.array(true_labels))

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input_file", type=str, required=True, help="Path to the test data file")
    parser.add_argument("--model_path", type=str, required=True, help="Path to the fine-tuned KoBERT model")
    parser.add_argument("--batch_size", type=int, default=16, help="Batch size for evaluation")
    parser.add_argument("--output_file", type=str, required=True, help="Path to save predictions")
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    tokenizer = BertTokenizer.from_pretrained(args.model_path)
    model = BertForSequenceClassification.from_pretrained(args.model_path)
    model.to(device)

    test_data, sentences, labels = load_data(args.input_file, tokenizer)
    test_dataloader = DataLoader(test_data, batch_size=args.batch_size)

    accuracy_score = evaluate(model, test_dataloader, sentences, labels, device, args.output_file)
    print(f"Accuracy on test data: {accuracy_score:.4f}")
    print(f"Predictions saved to {args.output_file}")

if __name__ == "__main__":
    main()
