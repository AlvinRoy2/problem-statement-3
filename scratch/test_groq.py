import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

if not client:
    print("No API Key found")
else:
    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "user", "content": "Hello"}
            ],
            model="llama3-8b-8192",
            max_tokens=10,
        )
        print("Groq API Success:", response.choices[0].message.content)
    except Exception as e:
        print("Groq API Failure:", e)
