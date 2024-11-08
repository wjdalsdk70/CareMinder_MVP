#!/bin/bash

export CUDA_VISIBLE_DEVICES=0  
export MODEL_PATH="onboard_classifier/"  

python scripts/onboard.py
