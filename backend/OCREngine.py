from paddleocr import PaddleOCR
from PIL import Image, ImageDraw
import cv2
import os

from backend.config import LOCAL_INPUT_IMAGE_DIR, LOCAL_OCR_IMAGE_DIR
from backend.parser_dispatchers.ocr_parsers.text_bounding_box import TextBoundingBox

class OCREngine:

    def __init__(self):
        self.paddle_ocr = PaddleOCR(use_angle_cls=True, lang='en')
        # self.detector = PaddleOCR(use_angle_cls=False, lang='en', det=True, rec=False)  # Detection only
        # self.recognizer = PaddleOCR(use_angle_cls=True, lang='en', det=False, rec=True)  # Recognition only

    def draw_ocr(self, filename:str, bounding_boxes:list[TextBoundingBox]) -> str:
        
        image_input_path = os.path.join(LOCAL_INPUT_IMAGE_DIR, filename)
        image_output_path = os.path.join(LOCAL_OCR_IMAGE_DIR, filename)

        image = cv2.imread(image_input_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = Image.fromarray(image)
        draw = ImageDraw.Draw(image)
        for bounding_box in bounding_boxes:
            draw.polygon(bounding_box.box, outline="red")
        image.save(image_output_path)

        return image_output_path

    def process_ocr(self, filename:str) -> list[TextBoundingBox]:
        
        image_input_path = os.path.join(LOCAL_INPUT_IMAGE_DIR, filename)
        result = self.paddle_ocr.ocr(image_input_path, cls=True)

        text_bounding_boxes = []
        for idx in range(len(result)):
            res = result[idx]
            if res is None:
                continue
            for line in res:
                text = line[1][0]
                score = line[1][1]
                if score < 0.85:
                    continue
                box = [(point[0], point[1]) for point in line[0]]
                text_bounding_boxes.append(TextBoundingBox(text, box, score))
        return text_bounding_boxes


if __name__=="__main__":
    ocrEngine = OCREngine()
    text_bounding_boxes = ocrEngine.process_ocr("bond_bloomberg.png")