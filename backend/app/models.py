from datetime import date as date_type
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Organization(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)


class Fighter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)
    password_hash: str
    weight_category: str
    organization_id: int = Field(foreign_key="organization.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Fight(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fighter_id: int = Field(foreign_key="fighter.id")
    opponent_id: int = Field(foreign_key="fighter.id")
    result: str
    description: str
    video_path: Optional[str] = None
    date: date_type = Field(default_factory=date_type.today)
