from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/micrologist")

# Railway entrega la URL con postgresql:// pero necesitamos postgresql+asyncpg://
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=os.getenv("DEBUG", "false").lower() == "true")
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def create_tables():
    from sqlalchemy import text
    async with engine.begin() as conn:
        from app.models import bus, conductor, usuario, turno, ingreso, audit_log  # noqa
        await conn.run_sync(Base.metadata.create_all)
        await conn.execute(text("ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'estandar' NOT NULL"))