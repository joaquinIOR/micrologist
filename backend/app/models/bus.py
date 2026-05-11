from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class EstadoBus(str, enum.Enum):
    activo   = "activo"
    inactivo = "inactivo"
    taller   = "taller"

class Bus(Base):
    __tablename__ = "buses"

    id                  = Column(Integer, primary_key=True, index=True)
    owner_id            = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    patente             = Column(String(10), nullable=False, index=True)
    marca               = Column(String(50), nullable=True)
    modelo              = Column(String(50), nullable=True)
    anio                = Column(Integer, nullable=True)
    color               = Column(String(30), nullable=True)
    recorrido           = Column(String(50), nullable=True)

    # Documentos críticos
    revision_tecnica    = Column(Date, nullable=True)   # Fecha de vencimiento
    soap                = Column(Date, nullable=True)   # Fecha de vencimiento
    permiso_circulacion = Column(Date, nullable=True)   # Fecha de vencimiento

    estado              = Column(Enum(EstadoBus), default=EstadoBus.activo)
    notas               = Column(String(500), nullable=True)
    created_at          = Column(DateTime(timezone=True), server_default=func.now())
    updated_at          = Column(DateTime(timezone=True), onupdate=func.now())

    owner    = relationship("Usuario", back_populates="buses")
    turnos   = relationship("Turno", back_populates="bus", cascade="all, delete-orphan")
