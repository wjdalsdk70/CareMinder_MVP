import argparse

label_mapping = {"의사": 0, "간호 인력": 1, "병원직원": 2}

def load_and_process_data(input_file, output_file):
    with open(input_file, "r", encoding="utf-8") as f_in, open(output_file, "w", encoding="utf-8") as f_out:
        for line in f_in:
            parts = line.strip().split("\t")
            if len(parts) == 2:
                content, label_str = parts
                label = label_mapping.get(label_str.strip())
                if label is not None: \
                    f_out.write(f"{content.strip()}\t{label}\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--input_file", type=str, required=True, help="Path to the input sources file")
    parser.add_argument("--output_file", type=str, required=True, help="Path to the output processed file")
    args = parser.parse_args()

    load_and_process_data(args.input_file, args.output_file)
