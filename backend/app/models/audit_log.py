from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id          = Column(Integer, primary_key=True, index=True)
    admin_email = Column(String(150), nullable=False)
    accion      = Column(String(50),  nullable=False)  # cambiar_plan, eliminar_usuario
    detalle     = Column(String(500), nullable=True)
    ip          = Column(String(50),  nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
