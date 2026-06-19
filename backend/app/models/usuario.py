from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id         = Column(Integer, primary_key=True, index=True)
    nombre     = Column(String(100), nullable=False)
    email      = Column(String(150), unique=True, index=True, nullable=False)
    password   = Column(String(255), nullable=False)
    empresa    = Column(String(150), nullable=True)
    ciudad     = Column(String(100), nullable=True)
    telefono   = Column(String(20), nullable=True)
    plan       = Column(String(20), nullable=False, default="estandar")
    activo     = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    buses      = relationship("Bus", back_populates="owner", cascade="all, delete-orphan")
    conductores = relationship("Conductor", back_populates="owner", cascade="all, delete-orphan")
