from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI(title="AI Interview Agent")

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Request / Response Models
# -------------------------

class ChatRequest(BaseModel):
    message: str
    role: str = "Frontend Developer"
    difficulty: str = "Medium"


class ChatResponse(BaseModel):
    reply: str
    type: str = "question"


# -------------------------
# Interview Questions
# -------------------------

questions = {
    "Frontend Developer": [
        "Tell me about yourself and your experience with frontend development.",
        "What is the difference between let, const and var in JavaScript?",
        "What is React and why is it useful?",
        "Explain the useEffect hook in React.",
        "How would you improve the performance of a React application?"
    ],

    "Backend Developer": [
        "Tell me about yourself and your backend experience.",
        "What is REST API?",
        "What is the difference between SQL and NoSQL?",
        "Explain authentication and authorization.",
        "How would you design a scalable backend?"
    ],

    "Full Stack Developer": [
        "Tell me about yourself and your full stack experience.",
        "Explain how frontend and backend communicate.",
        "What is REST API?",
        "How would you secure a full stack application?",
        "How would you scale a web application?"
    ],

    "Software Engineer": [
        "Tell me about yourself.",
        "Explain object oriented programming.",
        "What is the difference between stack and heap?",
        "What is time complexity?",
        "How do you approach solving a difficult programming problem?"
    ]
}


# -------------------------
# Chat / Interview Endpoint
# -------------------------

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):

    message = request.message.lower()

    # First question
    if message == "start":
        role_questions = questions.get(
            request.role,
            questions["Frontend Developer"]
        )

        return ChatResponse(
            reply=role_questions[0],
            type="question"
        )

    # Simple demo follow-up logic
    if "react" in message:

        return ChatResponse(
            reply="Good. Can you explain how useEffect works in React and give me a practical example?",
            type="follow-up"
        )

    if "javascript" in message:

        return ChatResponse(
            reply="Interesting. What is the difference between synchronous and asynchronous JavaScript?",
            type="follow-up"
        )

    # Generic follow-up
    return ChatResponse(
        reply="Good answer. Can you explain your reasoning with a practical example?",
        type="follow-up"
    )


# -------------------------
# Health Check
# -------------------------

@app.get("/")
async def root():
    return {
        "message": "AI Interview Agent Backend is running 🚀"
    }