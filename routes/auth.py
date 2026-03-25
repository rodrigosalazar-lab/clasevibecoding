from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class UserCredentials(BaseModel):
    correo: str
    contraseña: str

# Lista temporal para simular base de datos
users_db = []

@router.post("/login")
def login(credentials: UserCredentials):
    # Simular verificación de login (en una implementación real, verificarías contra la DB)
    return {
        "mensaje": "Login exitoso",
        "datos": {
            "correo": credentials.correo,
            "contraseña": credentials.contraseña
        }
    }

@router.post("/register")
def register(credentials: UserCredentials):
    # Almacenar en la lista temporal
    users_db.append({
        "correo": credentials.correo,
        "contraseña": credentials.contraseña
    })
    return {
        "mensaje": "Registro exitoso",
        "datos": {
            "correo": credentials.correo,
            "contraseña": credentials.contraseña
        }
    }