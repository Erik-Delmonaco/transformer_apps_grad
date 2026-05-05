from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
MODEL = "gemini-flash-lite-latest"

SECRET = 42

def secret_number():
    return SECRET


TOOL = types.Tool(function_declarations=[
    types.FunctionDeclaration(
        name="secret_number",
        description=(
            "Returns a single integer: the server's secret number."
            "Only call this when the user is explicitly asking the numeric "
            "secret value (e.g. 'What is the secret number?', 'tell me the secret number')."
            "Do NOT call for the unrelated uses of the word 'secret' such as "
            "secret admirers, secret recipes, secret identities, or general questions about secrets."
        ),
    ),
])

app = FastAPI()

@app.get("/ask_without")
def get_ask_without(text: str):
    response = client.models.generate_content(model=MODEL, contents=text)
    return response.text

@app.get("/ask_with")
def get_ask_with(text: str):
    response = client.models.generate_content(
        model=MODEL,
        config=types.GenerateContentConfig(tools=[TOOL]),
        contents=text,
    )
    

    call = response.candidates[0].content.parts[0].function_call
    if call:
        return secret_number()
    else:
        return response.text

app.mount("/", StaticFiles(directory="static", html=True), name="static")