import os, re, glob, sys
from collections import defaultdict
from sklearn.metrics import confusion_matrix
import uuid
from backend.config import TEXT_LABEL_MAP, LABEL_TEXT_MAP

uuid_pattern = re.compile(r'([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})')

classifier_dir = os.path.dirname(os.path.abspath(__file__))
classifier_dataset_dir = os.path.join(classifier_dir, "dataset")
text_filepaths = glob.glob(os.path.join(classifier_dataset_dir, "*.txt"))

def text_to_dataset():
    text_filepaths = glob.glob(os.path.join(classifier_dataset_dir, "*.txt"))
    sample_data = []
    sample_labels = []
    for text_filepath in text_filepaths:
        _, text_filename = os.path.split(text_filepath)
        label = TEXT_LABEL_MAP[text_filename.split(".")[0]]
        uuid_to_concatenated_string_dict = defaultdict(str)
        with open(text_filepath, "r") as filehandle:
            for text_line in filehandle.read().split("\n"):
                match = uuid_pattern.search(text_line)
                if match:
                    uuid = match.group(1)
                    # Remove the UUID and any leading/trailing whitespace from the line.
                    text = text_line.replace(uuid, '').strip()
                    # Concatenate the text to the existing string for this UUID.
                    uuid_to_concatenated_string_dict[uuid] += text + ' '
            for uuid_key, sample_text in uuid_to_concatenated_string_dict.items():
                sample_data.append(sample_text)
                sample_labels.append(label)
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

def store_msg_text(text:str):
    for text_filepath in text_filepaths:
        if "unsettle" in text_filepath and "unsettle" in text.lower():
            with open(text_filepath, "a") as filehandle:
                random_uuid = str(uuid.uuid4())
                filehandle.write(random_uuid + "<SEP>" + text + "</SEP>\n")
            break
        if "extract" in text_filepath and "extract" in text.lower():
            with open(text_filepath, "a") as filehandle:
                random_uuid = str(uuid.uuid4())
                filehandle.write(random_uuid + "<SEP>" + text + "</SEP>\n")
            break


def store_ocr_text(filename:str, text:str):
    filename_main = filename.split("__")[0]
    filename_main = re.sub(r"[\d]*\.drawio", "", filename_main)
    filename_uuid = filename.split("__")[1]
    text_filepath = None
    for text_filepath in text_filepaths:
        if filename_main in text_filepath:
            break
    if text_filepath is None:
        return
    sample_path = text_filepath
    trimmed_text = trim_text(text)
    with open(sample_path, "a") as filehandle:
        filehandle.write(filename_uuid + "<SEP>" + trimmed_text + "</SEP>\n")

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