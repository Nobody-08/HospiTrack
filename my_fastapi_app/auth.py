# my_fastapi_app/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import jwt

# This secret key MUST be the same as the one in your Django settings.py
SECRET_KEY = "your-shared-secret-key"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token") # We don't use the URL, just the scheme

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username") # Or user_id, whatever you put in the token
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"username": username}

# Then protect your endpoints like this:
# @app.get("/api/some_protected_data/")
# def get_protected_data(current_user: dict = Depends(get_current_user)):
#     return {"message": f"Hello {current_user['username']}!"}