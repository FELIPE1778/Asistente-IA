import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

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