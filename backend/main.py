from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import os

load_dotenv()

from app.database import create_tables
from app.routers import auth, buses, conductores, turnos, alertas, ingresos

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crear tablas al iniciar
    await create_tables()
    yield

app = FastAPI(
    title="MicroLogist API",
    description="Plataforma de gestión de flotas para transporte urbano",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — permite conexiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
        "http://localhost:3000",
        "https://micrologist.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(buses.router)
app.include_router(conductores.router)
app.include_router(turnos.router)
app.include_router(alertas.router)
app.include_router(ingresos.router)

@app.get("/")
async def root():
    return {"mensaje": "MicroLogist API funcionando 🚌", "version": "0.1.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}
