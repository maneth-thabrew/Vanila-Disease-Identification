import sys
from scipy.spatial.distance import euclidean
from imutils import perspective
from imutils import contours
import numpy as np
import imutils
import cv2
import io
import os

# Cloudinary
import cloudinary.api
import cloudinary.uploader

def show_images(images):
    for i, img in enumerate(images):
        cv2.imshow("image_" + str(i), img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def measure_objects(img_path):
    # Read image and preprocess
    image = cv2.imread(img_path)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (9, 9), 0)

    edged = cv2.Canny(blur, 50, 100)
    edged = cv2.dilate(edged, None, iterations=1)
    edged = cv2.erode(edged, None, iterations=1)

    # Find contours
    cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)

    # Sort contours left -> right 
    (cnts, _) = contours.sort_contours(cnts)

    # Remove contours not large enough
    cnts = [x for x in cnts if cv2.contourArea(x) > 100]

    ref_object = cnts[0]
    box = cv2.minAreaRect(ref_object)
    box = cv2.boxPoints(box)
    box = np.array(box, dtype="int")
    box = perspective.order_points(box)
    (tl, tr, br, bl) = box
    dist_in_pixel = euclidean(tl, tr)
    dist_in_cm = 2
    pixel_per_cm = dist_in_pixel/dist_in_cm
    longest_measure = 0
    # Draw 
    for cnt in cnts:
        box = cv2.minAreaRect(cnt)
        box = cv2.boxPoints(box)
        box = np.array(box, dtype="int")
        box = perspective.order_points(box)
        (tl, tr, br, bl) = box
        cv2.drawContours(image, [box.astype("int")], -1, (0, 0, 255), 2)
        mid_pt_horizontal = (tl[0] + int(abs(tr[0] - tl[0])/2), tl[1] + int(abs(tr[1] - tl[1])/2))
        mid_pt_verticle = (tr[0] + int(abs(tr[0] - br[0])/2), tr[1] + int(abs(tr[1] - br[1])/2))
        wid = euclidean(tl, tr)/pixel_per_cm
        ht = euclidean(tr, br)/pixel_per_cm
        cv2.putText(image, "{:.1f}cm".format(wid), (int(mid_pt_horizontal[0] - 15), int(mid_pt_horizontal[1] - 10)), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 2)
        cv2.putText(image, "{:.1f}cm".format(ht), (int(mid_pt_verticle[0] + 10), int(mid_pt_verticle[1])), 
            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 2)
        
        longest_measure = max(longest_measure, wid, ht)

    # Save the marked image to the same location
    marked_image_path = img_path.replace(".", "_marked.")
    cv2.imwrite(marked_image_path, image)

    # Cloudinary Upload
    cloudinary.config(
        cloud_name="dkox7lwxe",
        api_key="296453671463238",
        api_secret="LRTlmDWwxtSmlkKSm6QJRbI71_c",
        secure=True,
    )
    # print(f"Marked image saved at: {marked_image_path}")
    image_path = 'path/to/your/image.jpg'

    # Upload the image
    response = cloudinary.uploader.upload(marked_image_path)

    return response['secure_url'], longest_measure

def measure_objects2(img_path):
    # Read image and preprocess
    image = cv2.imread(img_path)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (9, 9), 0)

    edged = cv2.Canny(blur, 50, 100)
    edged = cv2.dilate(edged, None, iterations=1)
    edged = cv2.erode(edged, None, iterations=1)

    # Find contours
    cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)

    # Sort contours left -> right 
    (cnts, _) = contours.sort_contours(cnts)

    # Remove contours not large enough
    cnts = [x for x in cnts if cv2.contourArea(x) > 100]

    ref_object = cnts[0]
    box = cv2.minAreaRect(ref_object)
    box = cv2.boxPoints(box)
    box = np.array(box, dtype="int")
    box = perspective.order_points(box)
    (tl, tr, br, bl) = box
    dist_in_pixel = euclidean(tl, tr)
    dist_in_cm = 2
    pixel_per_cm = dist_in_pixel / dist_in_cm

    longest_measure = 0  # Variable to store the longest measure

    # Draw 
    for cnt in cnts:
        box = cv2.minAreaRect(cnt)
        box = cv2.boxPoints(box)
        box = np.array(box, dtype="int")
        box = perspective.order_points(box)
        (tl, tr, br, bl) = box
        cv2.drawContours(image, [box.astype("int")], -1, (0, 0, 255), 2)
        mid_pt_horizontal = (tl[0] + int(abs(tr[0] - tl[0]) / 2), tl[1] + int(abs(tr[1] - tl[1]) / 2))
        mid_pt_verticle = (tr[0] + int(abs(tr[0] - br[0]) / 2), tr[1] + int(abs(tr[1] - br[1]) / 2))
        wid = euclidean(tl, tr) / pixel_per_cm
        ht = euclidean(tr, br) / pixel_per_cm
        cv2.putText(image, "{:.1f}cm".format(wid), (int(mid_pt_horizontal[0] - 15), int(mid_pt_horizontal[1] - 10)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 2)
        cv2.putText(image, "{:.1f}cm".format(ht), (int(mid_pt_verticle[0] + 10), int(mid_pt_verticle[1])),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 2)

        # Update the longest_measure if a longer measure is found
        longest_measure = max(longest_measure, wid, ht)

    # Convert the image to a NumPy array
    marked_image = np.array(image)

    return marked_image, longest_measure

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python init.py <image_path>")
    else:
        image_path = sys.argv[1]
        marked_image = measure_objects(image_path)
        # Save or display the marked image as needed
