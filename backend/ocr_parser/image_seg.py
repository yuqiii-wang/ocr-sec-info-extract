import cv2
import numpy as np
from scipy.spatial.distance import euclidean

# Load the image
image = cv2.imread('/Users/yuqi/Desktop/ocr-sec-info-extract/backend/local_files/tmp_images/8ecf8946-283a-46fc-802d-71928a36b079.png')

# Get the dimensions of the image
height, width, _ = image.shape

# Function to compute the color histogram for an image region
def compute_histogram(image_region):
    hist = cv2.calcHist([image_region], [0, 1, 2], None, [8, 8, 8], [0, 256, 0, 256, 0, 256])
    cv2.normalize(hist, hist)
    return hist.flatten()

# Find the best vertical split based on histogram difference
best_x = 0
max_hist_diff = 0

for x in range(1, width - 1):  # Avoid edges
    left_region = image[:, :x, :]
    right_region = image[:, x:, :]
    
    # Compute histograms for both regions
    left_hist = compute_histogram(left_region)
    right_hist = compute_histogram(right_region)
    
    # Calculate the Euclidean distance between the histograms
    hist_diff = euclidean(left_hist, right_hist)
    
    # Keep track of the maximum histogram difference and corresponding x-coordinate
    if hist_diff > max_hist_diff:
        max_hist_diff = hist_diff
        best_x = x

# Split the image at the best_x coordinate
left_region = image[:, :best_x, :]
right_region = image[:, best_x:, :]

# Optionally, draw the line on the original image
cv2.line(image, (best_x, 0), (best_x, height), (0, 255, 0), 2)

# Display the results
cv2.imshow('Original Image with Line', image)
cv2.imshow('Left Region', left_region)
cv2.imshow('Right Region', right_region)
cv2.waitKey(0)
cv2.destroyAllWindows()