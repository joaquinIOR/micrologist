from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class EstadoConductor(str, enum.Enum):
    activo   = "activo"
    inactivo = "inactivo"
    licencia = "licencia"

class Conductor(Base):
    __tablename__ = "conductores"

    id                  = Column(Integer, primary_key=True, index=True)
    owner_id            = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    nombre              = Column(String(100), nullable=False)
    rut                 = Column(String(12), nullable=True, index=True)
    telefono            = Column(String(20), nullable=True)
    email               = Column(String(150), nullable=True)
    whatsapp            = Column(String(20), nullable=True)  # Para alertas directas al conductor

    # Documentos críticos
    tipo_licencia       = Column(String(5), nullable=True)   # A1, A2, A3, etc
    vencimiento_licencia = Column(Date, nullable=True)

    estado              = Column(Enum(EstadoConductor), default=EstadoConductor.activo)
    notas               = Column(String(500), nullable=True)
    created_at          = Column(DateTime(timezone=True), server_default=func.now())
    updated_at          = Column(DateTime(timezone=True), onupdate=func.now())

    owner  = relationship("Usuario", back_populates="conductores")
    turnos = relationship("Turno", back_populates="conductor", cascade="all, delete-orphan")
