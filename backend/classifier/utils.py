import os, re, glob, sys
from collections import defaultdict
import uuid
from backend.config import TEXT_LABEL_MAP

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
        if "unsettle" in text_filepath and "unsettle" in text:
            with open(text_filepath, "a") as filehandle:
                random_uuid = str(uuid.uuid4())
                filehandle.write(random_uuid + "<SEP>" + text + "</SEP>\n")
        if "extract" in text_filepath and "extract" in text:
            with open(text_filepath, "a") as filehandle:
                random_uuid = str(uuid.uuid4())
                filehandle.write(random_uuid + "<SEP>" + text + "</SEP>\n")


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