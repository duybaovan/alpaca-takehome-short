"use client";

import { useState } from "react";
import Link from "next/link";
import OpenAI from "openai";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import { uuidv4 } from "../utils/uuid";
import Spinner from "reactjs-simple-spinner";

const openai = new OpenAI({
  // Nextjs env variables were undefined even if prefaced with NEXT_PUBLIC_, as a
  // fallback, you can juse insert the API key I sent
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  // For the sake of interview purposes, im setting this to true, although a better
  // solution would be the santize the input, and have the backend generate the AI
  // paraphrased note
  dangerouslyAllowBrowser: true,
});

export default function GenerateNote() {
  const [observations, setObservations] = useState("");
  const [generatedNote, setGeneratedNote] = useState<
    string | ChatCompletionMessage
  >("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsProcessing(true);
    const generateNote = openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [{ role: "user", content: observations }],
    });

    generateNote
      .then((result) => {
        setGeneratedNote(result.choices[0].message);
        setIsProcessing(false);
      })
      .catch((error) => {
        setGeneratedNote(error.message);
        setIsProcessing(false);
      });
  };

  const handleSave = async () => {
    setIsProcessing(true);
    const today = new Date();
    const params = {
      id: uuidv4(),
      date: today.toISOString().split("T")[0],
      content: generatedNote,
    };

    fetch("http://localhost:8000/notes", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => {
        console.log(response.body);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex min-h-screen flex-col p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Generate Note</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>

      {!isProcessing && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Observations
            </label>
            <textarea
              className="w-full h-48 p-4 border rounded-lg"
              placeholder="Enter your observations here..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Generate Note
          </button>

          {generatedNote && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Generated Note</h2>
              <div className="p-4 border rounded-lg bg-gray-50">
                <p>{generatedNote.toString()}</p>
              </div>
              <button
                onClick={handleSave}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Save Note
              </button>
            </div>
          )}
        </div>
      )}

      {isProcessing && <Spinner size="medium" message="Loading..." />}
    </div>
  );
}
