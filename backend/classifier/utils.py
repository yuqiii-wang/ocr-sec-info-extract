import datetime
import os, re, glob, json
from collections import defaultdict
from datetime import datetime
from sklearn.metrics import confusion_matrix
from backend.config import TEXT_LABEL_MAP, LABEL_TEXT_MAP
from datetime import datetime

from backend.db.db_query_utils import insert_doc_to_dataset, query_dataset_by_time_range, insert_image_to_store

uuid_pattern = re.compile(r'([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})')


def text_to_dataset(training_labels:list[str]):
    training_labels = set(training_labels)
    sample_data = []
    sample_labels = []
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    queried_results = query_dataset_by_time_range("1970-01-01 00:00:00", now, return_items=["query_task", "uuid", "datetime", "content"])

    for item in queried_results:
        if (TEXT_LABEL_MAP.get(item["query_task"]) is None):
            continue
        if (not item["query_task"] in training_labels):
            continue
        sample_data.append(item["content"])
        sample_labels.append(TEXT_LABEL_MAP[item["query_task"]])
    return sample_data, sample_labels

def split_word_by_caps(text:str):
    words = text.split(" ")
    new_words = []
    for word in words:
        # Define the pattern: one or more lowercase letters followed by an uppercase letter,
        # but not at the beginning of the word.
        pattern = r'(?<!^)([a-z])([A-Z])'
        match = re.search(pattern, word)
        if match:
            split_index = match.start(2)  # Start of the uppercase letter
            word = word[:split_index] + ' ' + word[split_index:]
        new_words.append(word)

        # Define the pattern: pure digits followed by an uppercase letter,
        # but not likely a date.
        # pattern = r'(?<!^)([a-z])([A-Z])'
        # match = re.search(pattern, word)
        # if match:
        #     split_index = match.start(2)  # Start of the uppercase letter
        #     word = word[:split_index] + ' ' + word[split_index:]
        # new_words.append(word)
    return " ".join(new_words)

def trim_text(text:str):
    # trimmed_text = re.sub(r'[\d\/\.\(\)\[\]]+', "", text)
    trimmed_text = split_word_by_caps(text)
    return trimmed_text

def store_msg_text(text:str, task_label:str):
    insert_doc_to_dataset(text, task_label)


def store_ocr_text_and_image(text:str, filename:str, task_label:str, file_idx:int):
    filename_uuid = filename.split("__")[1]
    trimmed_text = trim_text(text)
    insert_doc_to_dataset(trimmed_text, task_label, filename_uuid, file_idx)
    insert_image_to_store(filename, task_label, filename_uuid, file_idx)


def compute_num_samples_per_label(sample_labels:list):
    num_samples_per_label_idx = {}
    for label in sample_labels:
        count = num_samples_per_label_idx.get(label, 0)
        count += 1
        num_samples_per_label_idx[label] = count
    num_samples_per_label = {LABEL_TEXT_MAP[k]: v for k, v in num_samples_per_label_idx.items()}
    return num_samples_per_label

def compute_accuracy_per_label(y_test:list, y_pred:list):
    unique_label_list:list = []
    unique_label_set:set = set()
    # confusion_matrix accuracies correspond to 
    # ordered presences of labels in y_test
    for label in y_test:
        if not label in unique_label_set:
            unique_label_list.append(label)
        unique_label_set.add(label)

    conf_mat = confusion_matrix(y_test, y_pred)
    acc_list = conf_mat.diagonal()/conf_mat.sum(axis=1)
    label_idx_acc_per_label_dict = {label: f"{acc * 100:.2f}%" for label, acc in zip(unique_label_list, acc_list)}
    label_acc_per_label_dict = {LABEL_TEXT_MAP[k]: v for k, v in label_idx_acc_per_label_dict.items()}
    return label_acc_per_label_dict