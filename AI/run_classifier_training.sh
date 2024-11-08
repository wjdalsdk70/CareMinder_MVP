#!/bin/bash
cd scripts
batch_size=16
num_epochs=100
seed=42

export CUDA_VISIBLE_DEVICES=0,1,2,3

python train_classifier1.py \
--train_file ../data/augmented_data \
--save_path ../model1/ \
--batch_size $batch_size \
--num_epochs $num_epochs \
--seed $seed
