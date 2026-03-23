import os
from dotenv import load_dotenv
from groq import Groq
from pathlib import Path

env_path = Path("C:/Users/FELIPE/OneDrive/asistente-ia/backend/.env")
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)

def preguntar_ia(mensajes: list, system_prompt: str) -> str:
    historial = [{"role": "system", "content": system_prompt}]

    for m in mensajes:
        historial.append({
            "role": "user" if m.rol == "usuario" else "assistant",
            "content": m.texto
        })

    respuesta = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=historial
    )
    return respuesta.choices[0].message.content