"""Chat Q&A over financial data using Claude."""

from backend.src.config.settings import ANTHROPIC_API_KEY
from backend.src.ai.summarize import _build_context


def answer_question(
    question: str,
    company: str,
    period: str,
    ratios: dict,
    statements: dict,
    summary: str = "",
) -> str:
    """
    Answer a financial question using Claude with the loaded financial data as context.
    Falls back to a plain message if ANTHROPIC_API_KEY is not set.
    """
    if not question.strip():
        return "Please ask a question about the financial statements."

    if not ANTHROPIC_API_KEY:
        return (
            "AI chat requires an Anthropic API key. "
            "Set the ANTHROPIC_API_KEY environment variable to enable this feature."
        )

    try:
        import anthropic  # type: ignore

        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        context = _build_context(company, period, ratios, statements)
        if summary:
            context = f"Executive Summary:\n{summary}\n\n{context}"

        system = (
            f"You are a financial analyst assistant specializing in SEC filings. "
            f"Answer questions about {company}'s {period} financial results. "
            f"Be concise (2–4 sentences or a short bulleted list). "
            f"Reference specific numbers from the data."
        )

        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=400,
            system=system,
            messages=[
                {
                    "role": "user",
                    "content": f"Financial Data:\n{context}\n\nQuestion: {question}",
                }
            ],
        )
        return response.content[0].text.strip()

    except Exception as exc:
        return f"Error generating response: {exc}"
