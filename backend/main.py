from fastapi import FastAPI
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

app = FastAPI(title="AI Interview Agent")

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Dummy response — replace with real AI logic later
    return ChatResponse(reply=f"Dummy reply: received your message -> {request.message}")