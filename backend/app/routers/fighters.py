from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from ..auth import get_current_fighter
from ..database import get_session
from ..models import Fighter
from ..schemas import FighterPublic
from ..serializers import fighter_to_public

router = APIRouter(prefix="/api/fighters", tags=["fighters"])


@router.get("/me", response_model=FighterPublic)
def read_me(current: Fighter = Depends(get_current_fighter), session: Session = Depends(get_session)):
    return fighter_to_public(current, session)


@router.get("", response_model=list[FighterPublic])
def list_fighters(
    current: Fighter = Depends(get_current_fighter),
    session: Session = Depends(get_session),
):
    """Other fighters in my organization (potential opponents)."""
    fighters = session.exec(
        select(Fighter).where(
            Fighter.organization_id == current.organization_id,
            Fighter.id != current.id,
        )
    ).all()
    return [fighter_to_public(f, session) for f in fighters]
