import argparse
import os
import re
import pandas as pd
import numpy as np
import random
from transformers import BertForSequenceClassification, BertTokenizer
import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader, RandomSampler
from torch.optim import AdamW
from transformers import get_scheduler
from tqdm import tqdm

def get_data(file):
    content = []
    label = []
    with open(file, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) == 2:
                c, l = parts
                content.append(c.strip())
                label.append(int(l.strip()))
    return content, label

def data_preprocess(file, tokenizer):
    content, label = get_data(file)
    data = pd.DataFrame({"content": content, "label": label})
    train_data = tokenizer(data.content.to_list(), padding="max_length", max_length=512, truncation=True, return_tensors="pt")
    train_label = torch.tensor(data.label.to_list())
    return train_data, train_label

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--train_file', type=str)
    parser.add_argument('--save_path', type=str)
    parser.add_argument('--batch_size', type=int, default=16)
    parser.add_argument('--num_epochs', type=int, default=3)
    parser.add_argument('--seed', type=int, default=42)
    args = parser.parse_args()

    random.seed(args.seed)
    np.random.seed(args.seed)
    torch.manual_seed(args.seed)
    torch.cuda.manual_seed_all(args.seed)

    tokenizer = BertTokenizer.from_pretrained("monologg/kobert")
    model = BertForSequenceClassification.from_pretrained("monologg/kobert", num_labels=3)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = nn.DataParallel(model, device_ids=[0, 1, 2, 3])
    model.to(device)
    
    train_data, train_label = data_preprocess(args.train_file, tokenizer)
    train_dataset = TensorDataset(train_data["input_ids"], train_data["attention_mask"], train_label)
    train_dataloader = DataLoader(train_dataset, batch_size=args.batch_size, sampler=RandomSampler(train_dataset))
    
    optimizer = AdamW(model.parameters(), lr=1e-5)
    num_training_steps = args.num_epochs * len(train_dataloader)
    lr_scheduler = get_scheduler("linear", optimizer=optimizer, num_warmup_steps=0, num_training_steps=num_training_steps)

    for epoch in range(args.num_epochs):
        model.train()
        total_loss = 0
        for batch in tqdm(train_dataloader, desc=f"Training Epoch {epoch+1}"):
            b_input_ids = batch[0].to(device)
            b_input_mask = batch[1].to(device)
            b_labels = batch[2].to(device)
            
            model.zero_grad()
            outputs = model(b_input_ids, attention_mask=b_input_mask, labels=b_labels)
            loss = outputs.loss.mean() 
            loss.backward()
            total_loss += loss.item()
            
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            lr_scheduler.step()
        
        avg_loss = total_loss / len(train_dataloader)
        print(f"Epoch {epoch+1} - Average Loss: {avg_loss}")
        
        model.module.save_pretrained(f"{args.save_path}/epoch_{epoch+1}")
        tokenizer.save_pretrained(f"{args.save_path}/epoch_{epoch+1}")

if __name__ == "__main__":
    main()
