from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

# 1) Base de datos en memoria
mascotas_db: List[Dict] = []
precios_base: Dict[str, float] = {
    "baño": 30,
    "corte": 50,
    "consulta": 40
}

class MascotaRegistro(BaseModel):
    correo: str
    nombre_mascota: str
    servicio: str
    fecha: str

class MascotaSalida(BaseModel):
    correo: str
    nombre_mascota: str
    servicio: str
    fecha: str
    precio: float

@router.post("/registrar-mascota")
def registrar_mascota(registro: MascotaRegistro):
    servicio = registro.servicio.lower()
    if servicio not in precios_base:
        raise HTTPException(status_code=400, detail="Servicio no válido")

    item = {
        "correo": registro.correo,
        "nombre_mascota": registro.nombre_mascota,
        "servicio": servicio,
        "fecha": registro.fecha,
        "precio": precios_base[servicio]
    }
    mascotas_db.append(item)
    return {"mensaje": "Mascota registrada con éxito", "registro": item}

@router.get("/mascotas/{correo}")
def listar_mascotas(correo: str):
    filtrados = [m for m in mascotas_db if m["correo"] == correo]
    if not filtrados:
        raise HTTPException(status_code=404, detail="No se encontraron mascotas para este correo")
    return {"mascotas": filtrados}

@router.get("/reporte/{correo}")
def reporte_usuario(correo: str):
    filtrados = [m for m in mascotas_db if m["correo"] == correo]
    if not filtrados:
        raise HTTPException(status_code=404, detail="No se encontraron registros para este correo")

    total_servicios = len(filtrados)
    servicios = [m["servicio"] for m in filtrados]
    total_gastado = sum(m["precio"] for m in filtrados)

    return {
        "correo": correo,
        "total_servicios": total_servicios,
        "servicios": servicios,
        "total_gastado": total_gastado
    }