import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlmodel import Session, select

from ..auth import get_current_fighter
from ..config import DESCRIPTIONS, RESULTS, VIDEOS_DIR
from ..database import get_session
from ..models import Fight, Fighter
from ..schemas import FightPublic
from ..serializers import fighter_to_public

router = APIRouter(prefix="/api/fights", tags=["fights"])

MAX_VIDEO_BYTES = 200 * 1024 * 1024  # 200 MB, generous for a phone-recorded clip


def fight_to_public(fight: Fight, session: Session) -> FightPublic:
    opponent = session.get(Fighter, fight.opponent_id)
    return FightPublic(
        id=fight.id,
        opponent=fighter_to_public(opponent, session),
        result=fight.result,
        description=fight.description,
        video_url=f"/media/{fight.video_path}" if fight.video_path else None,
        date=fight.date,
    )


@router.get("/me", response_model=list[FightPublic])
def list_my_fights(
    current: Fighter = Depends(get_current_fighter),
    session: Session = Depends(get_session),
):
    fights = session.exec(
        select(Fight).where(Fight.fighter_id == current.id).order_by(Fight.date.desc(), Fight.id.desc())
    ).all()
    return [fight_to_public(f, session) for f in fights]


@router.post("", response_model=FightPublic)
async def create_fight(
    opponent_id: int = Form(...),
    result: str = Form(...),
    description: str = Form(...),
    video: UploadFile | None = File(None),
    current: Fighter = Depends(get_current_fighter),
    session: Session = Depends(get_session),
):
    if result not in RESULTS:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Résultat invalide.")
    if description not in DESCRIPTIONS:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Description invalide.")
    if opponent_id == current.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Tu ne peux pas combattre contre toi-même.")

    opponent = session.get(Fighter, opponent_id)
    if not opponent or opponent.organization_id != current.organization_id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Adversaire invalide.")

    video_path = None
    if video is not None and video.filename:
        ext = Path(video.filename).suffix or ".mp4"
        stored_name = f"{uuid.uuid4().hex}{ext}"
        dest = VIDEOS_DIR / stored_name

        size = 0
        with open(dest, "wb") as out:
            while chunk := await video.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_VIDEO_BYTES:
                    out.close()
                    dest.unlink(missing_ok=True)
                    raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "Vidéo trop volumineuse (max 200 Mo).")
                out.write(chunk)
        video_path = f"videos/{stored_name}"

    fight = Fight(
        fighter_id=current.id,
        opponent_id=opponent_id,
        result=result,
        description=description,
        video_path=video_path,
    )
    session.add(fight)
    session.commit()
    session.refresh(fight)
    return fight_to_public(fight, session)
