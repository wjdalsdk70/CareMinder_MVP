#!/bin/bash

input_file="./data/TEST_DATA"  
model_path="./model/"  
batch_size=16  
output_file="./data/output/OUTPUT_DATA"

python ./scripts/eval.py \
  --input_file $input_file \
  --model_path $model_path \
  --batch_size $batch_size \
  --output_file $output_file
