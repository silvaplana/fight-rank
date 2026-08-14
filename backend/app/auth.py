from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session

from .config import SECRET_KEY, TOKEN_EXPIRE_HOURS
from .database import get_session
from .models import Fighter

bearer_scheme = HTTPBearer()


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_access_token(fighter_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    payload = {"sub": str(fighter_id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def get_current_fighter(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    session: Session = Depends(get_session),
) -> Fighter:
    unauthorized = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session invalide.")
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        fighter_id = int(payload.get("sub"))
    except (jwt.PyJWTError, TypeError, ValueError):
        raise unauthorized

    fighter = session.get(Fighter, fighter_id)
    if not fighter:
        raise unauthorized
    return fighter
