from sqlalchemy import Column, Integer, Date, Time, ForeignKey, DateTime, Enum, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class TipoTurno(str, enum.Enum):
    manana = "manana"
    tarde  = "tarde"
    noche  = "noche"
    completo = "completo"

class Turno(Base):
    __tablename__ = "turnos"

    id           = Column(Integer, primary_key=True, index=True)
    bus_id       = Column(Integer, ForeignKey("buses.id"), nullable=False)
    conductor_id = Column(Integer, ForeignKey("conductores.id"), nullable=False)
    fecha        = Column(Date, nullable=False, index=True)
    tipo         = Column(Enum(TipoTurno), default=TipoTurno.manana)
    hora_inicio  = Column(Time, nullable=True)
    hora_fin     = Column(Time, nullable=True)
    notas        = Column(String(200), nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    bus       = relationship("Bus", back_populates="turnos")
    conductor = relationship("Conductor", back_populates="turnos")
