from datetime import date as date_type

from pydantic import BaseModel


class SignupRequest(BaseModel):
    name: str
    password: str
    weight_category: str
    organization: str


class LoginRequest(BaseModel):
    name: str
    password: str


class FighterPublic(BaseModel):
    id: int
    name: str
    weight_category: str
    organization: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    fighter: FighterPublic


class FightPublic(BaseModel):
    id: int
    opponent: FighterPublic
    result: str
    description: str
    video_url: str | None
    date: date_type


class OrganizationPublic(BaseModel):
    name: str
