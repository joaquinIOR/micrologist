from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class FuenteIngreso(str, enum.Enum):
    importado = "importado"
    manual    = "manual"

class TipoTarifa(str, enum.Enum):
    completa     = "completa"
    adulto_mayor = "adulto_mayor"
    estudiante   = "estudiante"
    otro         = "otro"

class Ingreso(Base):
    __tablename__ = "ingresos"

    id              = Column(Integer, primary_key=True, index=True)
    owner_id        = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    bus_id          = Column(Integer, ForeignKey("buses.id"), nullable=True)
    fecha           = Column(Date, nullable=False, index=True)
    recorrido       = Column(String(100), nullable=True)
    total_pasajeros = Column(Integer, nullable=True)
    monto           = Column(Float, nullable=False)
    tipo_tarifa     = Column(Enum(TipoTarifa), default=TipoTarifa.completa)
    fuente          = Column(String(50), default=FuenteIngreso.manual)
    notas           = Column(String(300), nullable=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    bus   = relationship("Bus", backref="ingresos")