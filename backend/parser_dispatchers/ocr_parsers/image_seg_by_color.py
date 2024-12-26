import copy
import os, uuid
from PIL import Image
import cv2
import numpy as np
from sklearn.cluster import KMeans
from backend.config import LOCAL_OCR_TMP_IMAGE_DIR
from backend.parser_dispatchers.ocr_parsers.text_bounding_box import TextBoundingBox


class OCRByColorClustering:

    def __init__(self, ocr_engine):
        self.ocr_engine = ocr_engine
        

    def predict(self, file_path) -> list[TextBoundingBox]:
        
        text_bounding_boxes = []

        # Load the image
        image = cv2.imread(file_path)
        image_hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

        # Reshape the image data for clustering
        pixel_values = image_hsv.reshape((-1, 3))
        pixel_values = np.float32(pixel_values)

        # Apply K-Means clustering
        k = 7  # Number of color clusters
        kmeans = KMeans(n_clusters=k, random_state=42)
        labels = kmeans.fit_predict(pixel_values)

        # Create binary masks for each cluster
        masked_images = []
        for i in range(k):
            mask = (labels.reshape(image.shape[:2]) == i).astype(np.uint8) * 255
            masked_image = cv2.bitwise_and(image, image, mask=mask)
            masked_images.append(masked_image)

        for masked_image in masked_images:
            detection_results = self.ocr_engine.detector.ocr(masked_image, cls=True)
            for line in detection_results[0]:
                bounding_box = np.array(line[0], dtype=np.int32)
                x_min = min(bounding_box[:, 0])
                y_min = min(bounding_box[:, 1])
                x_max = max(bounding_box[:, 0])
                y_max = max(bounding_box[:, 1])
                
                # Clip the region from the image
                clipped_image = image[y_min:y_max, x_min:x_max]

                box = [[x_min, y_min], [x_max, y_min], [x_max, y_max], [x_min, y_max]]

                recognition_results = self.ocr_engine.recognizer.ocr(clipped_image)
                if recognition_results is None:
                    continue
                if recognition_results[0] is None:
                    continue

                text_items_to_join = []
                for result in recognition_results[0]:
                    text = result[1][0]
                    confidence = result[1][1]
                    if confidence > 0.9:
                        text_items_to_join.append(text)

                joined_text = " ".join(text_items_to_join)
                text_bounding_boxes.append(TextBoundingBox(joined_text, box, 0.9))
        return text_bounding_boxes