from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from ..database import get_session
from ..models import Organization
from ..schemas import OrganizationPublic

router = APIRouter(prefix="/api/organizations", tags=["organizations"])


@router.get("", response_model=list[OrganizationPublic])
def list_organizations(session: Session = Depends(get_session)):
    orgs = session.exec(select(Organization)).all()
    return [OrganizationPublic(name=o.name) for o in orgs]
