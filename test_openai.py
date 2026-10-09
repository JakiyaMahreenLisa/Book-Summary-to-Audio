from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI()


response = client.responses.create(
    model="gpt-5.6-luna",
    input="Explain what FastAPI is in one simple paragraph."
)

print(response.output_text)