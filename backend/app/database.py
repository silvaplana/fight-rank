from sqlmodel import Session, SQLModel, create_engine, select

from .config import DATABASE_URL, DEFAULT_ORGANIZATION, VIDEOS_DIR
from .models import Organization

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)


def init_db() -> None:
    VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        existing = session.exec(
            select(Organization).where(Organization.name == DEFAULT_ORGANIZATION)
        ).first()
        if not existing:
            session.add(Organization(name=DEFAULT_ORGANIZATION))
            session.commit()


def get_session():
    with Session(engine) as session:
        yield session
