"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Spinner from "reactjs-simple-spinner";

import { Note } from "../types";
export default function SavedNotes() {
  // This would typically fetch notes from an API
  const mockNotes = [
    { id: 1, date: "2024-03-20", preview: "Patient presented with..." },
    { id: 2, date: "2024-03-19", preview: "Follow-up appointment for..." },
  ];

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://localhost:8000/notes", {
      method: "GET",
    })
      .then((response) => {
        response.json().then((data) => {
          setNotes(data);
        });
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Saved Notes</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>

      {!isLoading && (
        <div className="space-y-4">
          {mockNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Date: {note.date}</span>
                <button className="text-blue-600 hover:underline">
                  View Full Note
                </button>
              </div>
              <p className="text-gray-600">{note.preview}</p>
            </div>
          ))}
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Date: {note.date.toString()}</span>
                <button className="text-blue-600 hover:underline">
                  View Full Note
                </button>
              </div>
              <p className="text-gray-600">{note.content}</p>
            </div>
          ))}
        </div>
      )}

      {isLoading && <Spinner size="medium" message="Loading..." />}
    </div>
  );
}
