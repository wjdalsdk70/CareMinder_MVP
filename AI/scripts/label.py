from collections import Counter

def count_labels(file_path):
    labels = []
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            parts = line.strip().split("\t")
            if len(parts) == 2:
                _, label = parts
                labels.append(label.strip())
    
    label_counts = Counter(labels)
    
    for label, count in label_counts.items():
        print(f"Label {label}: {count}개")

count_labels("../data/augmented_data")
