#!/bin/bash

export CUDA_VISIBLE_DEVICES=0  
export MODEL_PATH="model/"  

python scripts/inference.py
