from fastapi import FastAPI
from pydantic import BaseModel
import json

app = FastAPI(title="AI Interview Agent")


# -----------------------------
# Load candidate data
# -----------------------------

with open("data/candidates.json", "r", encoding="utf-8") as file:
    candidate_data = json.load(file)

candidates = candidate_data["candidates"]


# -----------------------------
# Load curriculum data
# -----------------------------

with open("data/curriculum.json", "r", encoding="utf-8") as file:
    curriculum_data = json.load(file)

curriculum_days = curriculum_data["days"]


# -----------------------------
# Find candidate
# -----------------------------

def find_candidate(candidate_id):
    for candidate in candidates:
        if candidate["member"]["id"] == candidate_id:
            return candidate

    return None


# -----------------------------
# Find curriculum day
# -----------------------------

def find_curriculum_day(day_number):
    for day in curriculum_days:
        if day["day"] == day_number:
            return day

    return None


# -----------------------------
# Analyze candidate
# -----------------------------

def analyze_candidate(candidate):

    passed_topics = []
    failed_topics = []
    skipped_topics = []
    high_attempt_topics = []

    for mission in candidate["missions"]:

        if mission.get("passed") is True:
            passed_topics.append({
                "day": mission["day"],
                "title": mission["title"],
                "attempts": mission.get("attempts", 0)
            })

        elif mission.get("passed") is False:
            failed_topics.append({
                "day": mission["day"],
                "title": mission["title"],
                "attempts": mission.get("attempts", 0)
            })

        elif mission.get("skipped") is True:
            skipped_topics.append({
                "day": mission["day"],
                "title": mission["title"]
            })

        if mission.get("attempts", 0) >= 3:
            high_attempt_topics.append({
                "day": mission["day"],
                "title": mission["title"],
                "attempts": mission["attempts"]
            })

    return {
        "candidate_id": candidate["member"]["id"],
        "name": candidate["member"]["name"],
        "job_role": candidate["member"]["jobRole"],
        "years_experience": candidate["member"]["yearsExperience"],
        "passed_topics": passed_topics,
        "failed_topics": failed_topics,
        "skipped_topics": skipped_topics,
        "high_attempt_topics": high_attempt_topics,
        "signals": candidate.get("signals", {})
    }


# -----------------------------
# Create interview plan
# -----------------------------

def create_interview_plan(analysis):

    passed_topics = analysis["passed_topics"]
    high_attempt_topics = analysis["high_attempt_topics"]

    # Prefer topics with higher attempt signals
    priority_days = []

    for topic in high_attempt_topics:
        if topic["day"] not in priority_days:
            priority_days.append(topic["day"])

    # Add other completed topics
    for topic in passed_topics:
        if topic["day"] not in priority_days:
            priority_days.append(topic["day"])

    # We need at least 4 different curriculum days
    selected_days = priority_days[:4]

    # Safety check
    if len(selected_days) < 4:
        selected_days = priority_days

    selected_topics = []

    for day_number in selected_days:

        curriculum_day = find_curriculum_day(day_number)

        if curriculum_day is not None:
            selected_topics.append({
                "day": curriculum_day["day"],
                "title": curriculum_day["title"],
                "objectives": curriculum_day["objectives"],
                "tools": curriculum_day["tools"]
            })

    # Decide initial difficulty
    if analysis["signals"].get("missionsFirstTry", 0) >= 25:
        difficulty = "advanced"

    elif analysis["signals"].get("missionsFirstTry", 0) >= 15:
        difficulty = "medium"

    else:
        difficulty = "beginner"

    return {
        "target_days": selected_days,
        "topics": selected_topics,
        "difficulty": difficulty,
        "minimum_questions": 8,
        "minimum_days": 4,
        "maximum_questions": 12
    }


# -----------------------------
# Temporary interview memory
# -----------------------------

sessions = {}


class InterviewRequest(BaseModel):
    sessionId: str
    candidate: dict | None = None
    message: str | None = None


# -----------------------------
# Basic endpoints
# -----------------------------

@app.get("/")
def root():
    return {
        "message": "AI Interview Agent backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# -----------------------------
# Interview endpoint
# -----------------------------

@app.post("/api/interview")
def interview(request: InterviewRequest):

    session_id = request.sessionId

    # -------------------------
    # Start interview
    # -------------------------

    if request.candidate is not None and request.message is None:

        candidate_id = request.candidate.get("member", {}).get("id")

        candidate = find_candidate(candidate_id)

        if candidate is None:
            return {
                "reply": "Candidate not found.",
                "done": True
            }

        # Analyze candidate
        analysis = analyze_candidate(candidate)

        # Create interview plan
        plan = create_interview_plan(analysis)

        # Save session
        sessions[session_id] = {
            "candidate": candidate,
            "analysis": analysis,
            "plan": plan,
            "question_count": 0,
            "covered_days": [],
            "history": [],
            "status": "active"
        }

        return {
            "reply": f"Welcome {candidate['member']['name']}. Let's begin your interview.",
            "done": False
        }

    # -------------------------
    # Continue interview
    # -------------------------

    if session_id not in sessions:
        return {
            "reply": "This interview session does not exist. Please start a new interview.",
            "done": True
        }

    session = sessions[session_id]

    session["history"].append({
        "message": request.message
    })

    session["question_count"] += 1

    return {
        "reply": "Thanks for your answer. Let's continue.",
        "done": False
    }