from pydantic import BaseModel
from datetime import datetime

class Note(BaseModel):
    id: str
    date: datetime
    content: str