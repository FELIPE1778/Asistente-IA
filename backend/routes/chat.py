from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from services.gemini import preguntar_ia

router = APIRouter()

class Mensaje(BaseModel):
    rol: str
    texto: str

class Conversacion(BaseModel):
    mensajes: List[Mensaje]
    modo: str = "chat"


MODOS = {
    "chat": "Eres un asistente útil y amigable. Responde de forma clara y concisa. No uses asteriscos, markdown, ni ningún tipo de formato especial. Solo texto plano.",
    "resumir": "Eres un experto resumiendo textos. Resume el siguiente texto de forma clara en puntos clave. No uses asteriscos, markdown, ni ningún tipo de formato especial. Solo texto plano.",
    "mejorar": "Eres un experto en redacción. Mejora el texto manteniendo el mismo significado pero con mejor gramática y estilo. No uses asteriscos, markdown, ni ningún tipo de formato especial. Solo texto plano.",
    "traducir": "Eres un traductor experto. Traduce al inglés el texto que te den. Responde solo con la traducción. Sin asteriscos ni formato especial.",
}

@router.post("/chat")
def chat(conversacion: Conversacion):
    system_prompt = MODOS.get(conversacion.modo, MODOS["chat"])
    respuesta = preguntar_ia(conversacion.mensajes, system_prompt)
    return {"respuesta": respuesta}