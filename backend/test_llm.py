from llm_service import generate_question

prompt = """
You are a technical interviewer.

Ask one technical interview question about Retrieval-Augmented Generation.
Return only the question.
"""

question = generate_question(prompt)

print(question)