from fastapi import FastAPI, HTTPException
from models import Note
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI()

# In-memory database for interview purposes
notes_db = {}

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "healthy"}

@app.get("/notes", response_model=List[Note])
async def get_notes():
    return list(notes_db.values())

# Get a single note by ID
@app.get("/notes/{note_id}", response_model=Note)
async def get_note(note_id: int):
    note = notes_db.get(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

# Create a new note
@app.post("/notes", response_model=Note)
async def create_note(note: Note):
    if note.id in notes_db:
        raise HTTPException(status_code=400, detail="Note with this ID already exists")
    notes_db[note.id] = note
    return note

# Update an existing note by ID
@app.put("/notes/{note_id}", response_model=Note)
async def update_note(note_id: int, updated_note: Note):
    if note_id not in notes_db:
        raise HTTPException(status_code=404, detail="Note not found")
    notes_db[note_id] = updated_note
    return updated_note

# Delete a note by ID
@app.delete("/notes/{note_id}")
async def delete_note(note_id: int):
    if note_id not in notes_db:
        raise HTTPException(status_code=404, detail="Note not found")
    del notes_db[note_id]
    return {"message": f"Note {note_id} deleted successfully"}
