from sqlmodel import Session

from .models import Fighter, Organization
from .schemas import FighterPublic


def fighter_to_public(fighter: Fighter, session: Session) -> FighterPublic:
    org = session.get(Organization, fighter.organization_id)
    return FighterPublic(
        id=fighter.id,
        name=fighter.name,
        weight_category=fighter.weight_category,
        organization=org.name if org else "",
    )
