import random
import uuid
import time
from datetime import datetime
from ..models.prediction import Grade


def mock_inference() -> tuple[Grade, float, dict]:
    """
    Simulate model inference with realistic weighted random predictions.

    Returns:
        grade: The predicted cataract grade
        confidence: Confidence score for the prediction
        probabilities: Softmax-like probability distribution
    """
    weights = [0.42, 0.35, 0.23]  # Normal, Immature, Mature
    random_value = random.random()

    if random_value < weights[0]:
        grade = Grade.NORMAL
        confidence = 88.0 + random.random() * 10  # 88-98%
    elif random_value < weights[0] + weights[1]:
        grade = Grade.IMMATURE
        confidence = 82.0 + random.random() * 14  # 82-96%
    else:
        grade = Grade.MATURE
        confidence = 91.0 + random.random() * 8  # 91-99%

    confidence = min(99.9, confidence)

    # Generate softmax-like probabilities
    remaining = 100 - confidence
    other_1 = random.uniform(0.3, 0.7) * remaining
    other_2 = remaining - other_1

    probabilities = {}

    if grade == Grade.NORMAL:
        probabilities = {
            "normal": round(confidence, 1),
            "immature": round(other_1, 1),
            "mature": round(other_2, 1)
        }
    elif grade == Grade.IMMATURE:
        probabilities = {
            "normal": round(other_1, 1),
            "immature": round(confidence, 1),
            "mature": round(other_2, 1)
        }
    else:
        probabilities = {
            "normal": round(other_2, 1),
            "immature": round(other_1, 1),
            "mature": round(confidence, 1)
        }

    return grade, confidence, probabilities


PREPROCESSING_STEPS = [
    "Resized to 224x224",
    "CLAHE contrast enhancement applied",
    "Pixel values normalized to [0, 1]",
    "Batch dimension added"
]


def prediction_id() -> str:
    return f"pred-{int(time.time() * 1000)}"


def create_prediction_record(
    user_id: str,
    image_id: str,
    image_url: str,
    age: int | None,
    sex: str | None,
    eye_side: str | None,
    notes: str | None
) -> dict:
    """
    Create a mock prediction record with realistic data.
    """
    grade, confidence, probabilities = mock_inference()
    processing_time = 1.5 + random.random() * 1.5

    return {
        "id": prediction_id(),
        "userId": user_id,
        "imageId": image_id,
        "imageUrl": image_url,
        "grade": grade.value,
        "confidence": round(confidence, 1),
        "probabilities": probabilities,
        "age": age,
        "sex": sex,
        "eyeSide": eye_side,
        "notes": notes,
        "preprocessingSteps": PREPROCESSING_STEPS,
        "modelVersion": "resnet50_v1",
        "processingTime": round(processing_time, 2),
        "createdAt": datetime.utcnow()
    }
