import base64
import requests
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# Path to the static image from which you want to extract information through openai.
image_path = "map.png"

# Function to encode the image
def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Encode the image at startup
base64_image = encode_image(image_path)

@app.post("/info/")
async def process_image(query: str):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"
    }

    payload = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"The image is the india map. Use the image to answer the following question. If you are not able to get the information from the image, reply back saying you do not have information for same. Question: {query}"
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{base64_image}"
                        }
                    }
                ]
            }
        ],
        "max_tokens": 16384
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    return JSONResponse(content=response.json())
