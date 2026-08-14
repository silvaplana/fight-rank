from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..auth import create_access_token, hash_password, verify_password
from ..config import WEIGHT_CATEGORIES
from ..database import get_session
from ..models import Fighter, Organization
from ..schemas import LoginRequest, SignupRequest, TokenResponse
from ..serializers import fighter_to_public

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
def signup(payload: SignupRequest, session: Session = Depends(get_session)):
    name = payload.name.strip()
    if not name or not payload.password:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Pseudo et mot de passe requis.")
    if payload.weight_category not in WEIGHT_CATEGORIES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Catégorie de poids invalide.")

    org = session.exec(select(Organization).where(Organization.name == payload.organization)).first()
    if not org:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Organisation invalide.")

    existing = session.exec(select(Fighter).where(Fighter.name == name)).first()
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Ce pseudo est déjà utilisé.")

    fighter = Fighter(
        name=name,
        password_hash=hash_password(payload.password),
        weight_category=payload.weight_category,
        organization_id=org.id,
    )
    session.add(fighter)
    session.commit()
    session.refresh(fighter)

    token = create_access_token(fighter.id)
    return TokenResponse(access_token=token, fighter=fighter_to_public(fighter, session))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, session: Session = Depends(get_session)):
    invalid = HTTPException(status.HTTP_401_UNAUTHORIZED, "Pseudo ou mot de passe incorrect.")
    fighter = session.exec(select(Fighter).where(Fighter.name == payload.name.strip())).first()
    if not fighter or not verify_password(payload.password, fighter.password_hash):
        raise invalid

    token = create_access_token(fighter.id)
    return TokenResponse(access_token=token, fighter=fighter_to_public(fighter, session))
