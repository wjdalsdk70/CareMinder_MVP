import numpy as np

def accuracy(preds, labels):
    match_count = 0
    for pred, label in zip(preds, labels):
        if pred == label:
            match_count += 1
    return 100 * (match_count / len(preds))