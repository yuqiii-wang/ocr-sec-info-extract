from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.pipeline import make_pipeline
import pickle
import os
from backend.classifier.utils import (text_to_dataset,
                                      compute_num_samples_per_label,
                                      compute_accuracy_per_label)
from backend.config import TEXT_LABEL_MAP, LABEL_TEXT_MAP


dt_model_file = 'dt_model.pkl'
classifier_dir = os.path.dirname(os.path.abspath(__file__))
classifier_dt_model_path = os.path.join(classifier_dir, f"{dt_model_file}")

class DT_Classifier:

    def __init__(self):
        self.tfidf_dt_clf = self.load_clf()

    def predict(self, text):
        label_preds = self.tfidf_dt_clf.predict([text])
        label_pred = label_preds[0]
        return label_pred

    def load_clf(self, classifier_dt_model_path=classifier_dt_model_path):
        if not os.path.exists(classifier_dt_model_path):
            train_dt_model()
        with open(classifier_dt_model_path, 'rb') as file:
            tfidf_dt_clf = pickle.load(file)
        return tfidf_dt_clf

def train_dt_model(training_labels:list=[label for label in TEXT_LABEL_MAP.keys()]):
    sample_data, sample_labels = text_to_dataset(training_labels)

    tfidf_dt_clf = make_pipeline(TfidfVectorizer(), DecisionTreeClassifier())
    X_train, X_test, y_train, y_test = train_test_split(sample_data, sample_labels, test_size=0.3, random_state=42)
    tfidf_dt_clf.fit(X_train, y_train)
    y_pred = tfidf_dt_clf.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
    perf_metrics = {
        "accuracyAll": f"{accuracy * 100:.2f}%",
        "precisionAll": f"{precision * 100:.2f}%",
        "recallAll": f"{recall * 100:.2f}%",
        "f1All": f"{f1 * 100:.2f}%",
        "numberSamplesPerLabel": compute_num_samples_per_label(sample_labels),
        "accuracyPerLabel": compute_accuracy_per_label(y_test, y_pred)
    }

    # Save the model to a file using pickle
    with open(classifier_dt_model_path, 'wb') as file:
        pickle.dump(tfidf_dt_clf, file)

    return perf_metrics
