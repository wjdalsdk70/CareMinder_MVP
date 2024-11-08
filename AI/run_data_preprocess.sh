#!/bin/bash

input_file="./data/sources"  
output_file="./data/processed_data"  

python ./scripts/data_process.py --input_file $input_file --output_file $output_file
