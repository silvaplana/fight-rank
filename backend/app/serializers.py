from sqlmodel import Session

from .models import Fighter, Organization
from .schemas import FighterPublic


def fighter_to_public(fighter: Fighter | None, session: Session) -> FighterPublic:
    if fighter is None:
        # Defensive fallback: there's no delete-fighter endpoint today, but a
        # fight should never 500 just because its opponent record vanished.
        return FighterPublic(id=0, name="Combattant supprimé", weight_category="", organization="")
    org = session.get(Organization, fighter.organization_id)
    return FighterPublic(
        id=fighter.id,
        name=fighter.name,
        weight_category=fighter.weight_category,
        organization=org.name if org else "",
    )
