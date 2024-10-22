import os, re, glob
from backend.config import TEXT_LABEL_MAP

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
        with open(text_filepath, "r") as filehandle:
            for text_line in filehandle.read().split("\n"):
                sample_data.append(text_line)
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
    return " ".join(new_words)

def trim_text(text:str):
    trimmed_text = re.sub(r'[\d\/\.\(\)\[\]]+', "", text)
    trimmed_text = split_word_by_caps(trimmed_text)
    return trimmed_text

def store_text(filename:str, text:str):
    prefix_filename = filename.split(".")[0].split("_")[0]
    text_filepath = None
    for text_filepath in text_filepaths:
        if prefix_filename in text_filepath:
            break
    if text_filepath is None:
        return
    sample_path = text_filepath
    trimmed_text = trim_text(text)
    with open(sample_path, "a") as filehandle:
        filehandle.write(trimmed_text)