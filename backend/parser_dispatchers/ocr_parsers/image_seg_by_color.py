import copy
import os, uuid
from PIL import Image
import cv2
import numpy as np
from sklearn.cluster import KMeans
from backend.config import LOCAL_OCR_TMP_IMAGE_DIR
from backend.parser_dispatchers.ocr_parsers.text_bounding_box import TextBoundingBox


VAR_THRESHOLD = 64**2  # assume pixel diff of 8


class ImageSegByColor:

    def __init__(self, ocr_engine):
        self.ocr_engine = ocr_engine

    # Segment small image regions if detected this image region contains more than two
    # colors (a background color and text color)
    # Paddle OCR does NOT have the capability recognizing bounding box by color, however,
    # color contains rich semantics defining if texts are related.
    def reseg_image_by_color(self, filepath:str, text_bounding_boxes:list[TextBoundingBox]):
        image_regions = self._load_image_regions(filepath, text_bounding_boxes)
        for image_region in image_regions:
            color_count, unique_color_centers = self._judge_color_count(image_region)
            if color_count < 3:
                pass
            else:
                new_text_bounding_boxes = self._seg_image_by_color(image_region, unique_color_centers)
        return new_text_bounding_boxes

    # assume unique_color_centers.size() is 3, the image contains one background color
    # and two text colors
    # to achieve the segmentation goal, first replacing color with a possible background
    # color, then apply ocr to build two useful bounding boxes
    def _seg_image_by_color(self, image, unique_color_centers, 
                            var_threshold=VAR_THRESHOLD):
        text_bounding_boxes = []
        unique_color_centers_copy = copy.deepcopy(unique_color_centers)
        # for there are only three items, 
        # the full combination and permutation of two items is 6 = C^2_3
        # and modula can iterate all combination and permutation pairs
        # with idx paired with idx+1 and idx-1
        for idx in range(3):
            # for idx+1
            masked_image = self._replace_pixel_within_variance_of_color(image, unique_color_centers_copy[idx%3],
                                                                        unique_color_centers_copy[(idx+1)%3])
            masked_image_tmp_path = os.path.join(LOCAL_OCR_TMP_IMAGE_DIR, str(uuid.uuid4())+".png")
            masked_image.save(masked_image_tmp_path)
            text_bounding_tmp_boxes = self.ocr_engine.process_ocr(masked_image_tmp_path)
            text_bounding_boxes += text_bounding_tmp_boxes
            # for idx-1
            masked_image = self._replace_pixel_within_variance_of_color(image, unique_color_centers_copy[idx%3],
                                                                        unique_color_centers_copy[(idx-1)%3])
            masked_image_tmp_path = os.path.join(LOCAL_OCR_TMP_IMAGE_DIR, str(uuid.uuid4())+".png")
            masked_image.save(masked_image_tmp_path)
            text_bounding_tmp_boxes = self.ocr_engine.process_ocr(masked_image_tmp_path)
            text_bounding_boxes += text_bounding_tmp_boxes

        return text_bounding_boxes

    def _replace_pixel_within_variance_of_color(self, image, src_color, new_color, 
                                                var_threshold=VAR_THRESHOLD):
        std_var_threshold = np.sqrt(var_threshold)

        # Convert the image to a numpy array for easier manipulation
        image_array = np.array(image)

        # just remove the edge
        image_grey_array = cv2.cvtColor(image_array, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(image_grey_array, 50, 150)  # You can adjust the thresholds
        # Optionally, dilate the edges to make them more visible
        # Disable dilation by setting kernel filter 1 x 1
        kernel = np.ones((1, 1), np.uint8)
        dilated_edges = cv2.dilate(edges, kernel, iterations=1)
        edge_mask = dilated_edges > 0  # This will create a boolean mask where edges are True
        image_array[edge_mask] = src_color
        
        # Define the target and new colors as numpy arrays
        target_color = np.array(src_color)
        new_color = np.array(new_color)
        
        # Calculate the difference between each pixel and the target color
        diff = np.abs(image_array - target_color)
        
        # Create a mask where the difference is within the specified variance
        mask = np.all(diff <= std_var_threshold, axis=-1)
        
        # Replace the pixels within the variance with the new color
        image_array[mask] = new_color
        
        # Convert the numpy array back to an image
        masked_image = Image.fromarray(image_array)

        return masked_image

    def _load_image_regions(self, filepath:str, text_bounding_boxes:list[TextBoundingBox]):
        # Load the image and convert it to RGB
        image = Image.open(filepath).convert('RGB')
        width, height = image.size
        image_regions = []
        for text_bounding_box in text_bounding_boxes:
            leftX_bottomY_pnt = text_bounding_box.box[0]
            rightX_upperY_pnt = text_bounding_box.box[2]
            anchor_pnts = [leftX_bottomY_pnt[0]-1, rightX_upperY_pnt[1]+2,
                               rightX_upperY_pnt[0]+1, leftX_bottomY_pnt[1]-2]
            # swap for pillow has a diff image coord than paddle ocr
            anchor_pnts[1], anchor_pnts[3] = anchor_pnts[3], anchor_pnts[1]
            # param box: The crop rectangle, as a (left, upper, right, lower)-tuple.
            image_region = image.crop(anchor_pnts)
            # image_region = self._convert_edge_to_main_body_color(image_region)
            image_regions.append(image_region)
        return image_regions

    def _get_image_colors(self, image, n_clusters=3):
        # Convert the image into a numpy array
        image_array = np.array(image)
        
        # Reshape the image to be a list of pixels (flattening the image)
        reshaped_image = image_array.reshape(-1, 3)
        
        # Use KMeans to find the most dominant colors
        kmeans = KMeans(n_clusters=n_clusters, random_state=42)
        kmeans.fit(reshaped_image)
        
        # Get the unique colors from the cluster centers
        unique_colors = kmeans.cluster_centers_
        
        return unique_colors

    def _judge_color_count(self, image_region):

        # Try with 2 clusters first
        unique_colors_2 = self._get_image_colors(image_region, n_clusters=2)
        
        # If the variance within the clusters is very low, it may mean the image has less than 2 colors
        # Calculate the variance of each color channel within the clusters
        # only 2 * 3 : two centers of three RGB channels
        diff_color = unique_colors_2[0] - unique_colors_2[1]
        variances_2 = np.sum([gap**2 for gap in diff_color]) / 3
        
        # Check if all variances are below the threshold
        if variances_2 < VAR_THRESHOLD:
            unique_color_centers = unique_colors_2[0]
            return 1, unique_color_centers  # Or you could return 0, depending on your definition of "one color"
        
        # Now try with 3 clusters
        unique_colors_3 = self._get_image_colors(image_region, n_clusters=3)

        # only 3 * 3 : three centers of three RGB channels
        rgb0 = unique_colors_3[0]
        rgb1 = unique_colors_3[1]
        rgb2 = unique_colors_3[2]
        variances_2_0 = np.sum([gap**2 for gap in rgb0-rgb1]) / 3
        variances_2_1 = np.sum([gap**2 for gap in rgb0-rgb2]) / 3
        variances_2_2 = np.sum([gap**2 for gap in rgb1-rgb2]) / 3
        
        # Check the number of significant colors
        if variances_2_0 < VAR_THRESHOLD or variances_2_1 < VAR_THRESHOLD \
               or  variances_2_2 < VAR_THRESHOLD:
            unique_color_centers = unique_colors_2
            return 2, unique_color_centers
        else:
            unique_color_centers = unique_colors_3
            return 3, unique_color_centers  # Or more, but we only checked up to 3
