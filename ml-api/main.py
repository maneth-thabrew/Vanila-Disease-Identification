from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from fastapi.responses import JSONResponse
import cv2
import tempfile
import joblib
from pydantic import BaseModel
from spec_quality import measure_objects


app = FastAPI()
origins = [
    "http://localhost:3000",
    "http://localhost:3001"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the Keras model from the h5 file
model = tf.keras.models.load_model("model_van_ap1.h5")  
model_iot = joblib.load("model.joblib")  
CLASS_NAMES = ["Bean Rot", "Black Crust", "Damaged", "Fungal Disease", "Healthy", "Mosaic Virus", "Root Rot"]
UPLOADS_DIR = "./uploads"

Path(UPLOADS_DIR).mkdir(parents=True, exist_ok=True)


@app.post("/predict")
async def predictInfo(file: UploadFile = File(...)):
    try:
        original_filename = file.filename
        file_extension = Path(original_filename).suffix
        save_path = Path(UPLOADS_DIR) / file.filename

        # Save the uploaded file to the specified directory
        with open(save_path, "wb") as image_file:
            image_file.write(await file.read())

        # Load and preprocess the image for prediction
        image = Image.open(save_path)
        image = image.resize((48, 48))  # Resize the image to 48x48 pixels
        image = image.convert("L")  # Convert the image to grayscale
        image = np.array(image) / 255.0  # Normalize the image
        image = image.reshape((1, 48, 48, 1))

        # Make predictions using the loaded model
        result = model.predict(image)
        prediction_class = CLASS_NAMES[np.argmax(result)]

        return {"disease": prediction_class}
    except Exception as e:
        return {"error": str(e)}
    

@app.post("/specimen-quality")
async def predict_info(file: UploadFile = File(...)):
    try:
        original_filename = file.filename
        save_path = Path(UPLOADS_DIR) / file.filename

        # Save the uploaded file to the specified directory
        with open(save_path, "wb") as image_file:
            image_file.write(await file.read())

        # Call the measure_objects function with the file path
        file, longest = measure_objects(str(save_path))

        return {"marked_image": file, "longest_measure": longest}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/specimen-quality-im")
async def predict_info(file: UploadFile = File(...)):
    try:
        original_filename = file.filename
        save_path = Path(UPLOADS_DIR) / str(file.filename)  # Convert to string

        # Save the uploaded file to the specified directory
        with open(save_path, "wb") as image_file:
            image_file.write(await file.read())

        # Read the image and call the measure_objects function
        marked_image, longest_measure = measure_objects2(str(save_path))

        # Save the marked image to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            cv2.imwrite(temp_file.name, marked_image)

        # Return the marked image file as a response
        marked_image_response = FileResponse(temp_file.name, media_type="image/jpg", filename="marked_image.jpg")

        # Return the longest measure as a separate JSON response
        longest_measure_response = {"longest_measure": longest_measure}

        return {"marked_image": marked_image_response, "longest_measure": longest_measure_response}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


# IOT Prediction
class InputData(BaseModel):
    diseased: float
    damaged: float
    summer: float
    seeds: float

FERTILIZER_CLASSES = [
    [0,0,0,0],
    [1,1,1,1],
    [1,0,0,1],
    [1,0,0,1],
    [1,0,0,0],
    [1,1,1,1],
    [0,1,0,1],
    [1,1,1,1],
    [1,1,1,1],
    [1,1,1,1],
]

@app.post("/predict-iot")
def predict(input_data: InputData):
    # Convert input data to a numpy array
    input_data_array = np.asarray([input_data.diseased, input_data.damaged, input_data.summer, input_data.seeds])

    # Reshape the numpy array
    input_data_reshaped = input_data_array.reshape(1, -1)

    # Make prediction
    prediction = model_iot.predict(input_data_reshaped)

    return {"prediction": FERTILIZER_CLASSES[prediction[0]], "index": int(prediction[0])}

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port="8000")
