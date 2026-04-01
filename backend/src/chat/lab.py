"""AI Lab: compute custom ratios and generate chart data on demand."""

import json

from backend.src.config.settings import ANTHROPIC_API_KEY
from backend.src.ai.summarize import _build_context

_SYSTEM_PROMPT = """You are a quantitative financial analyst. The user wants you to compute custom metrics or create charts from SEC filing data.

Respond with valid JSON only — no markdown fences, no explanation outside the JSON. Use this exact schema:

{
  "explanation": "1-3 sentence plain-English explanation of what you computed and what it means",
  "ratios": [
    {"label": "Metric Name", "value": 8.5, "description": "What this measures", "is_percent": false}
  ],
  "chart": {
    "title": "Chart Title",
    "series": [
      {"name": "Series Name", "is_percent": false, "data": [{"period": "FY2021", "value": 365.8}]}
    ]
  }
}

Rules:
- "explanation" is always required.
- "ratios" is optional — include only when computing point-in-time metric values.
- "chart" is optional — include only when the user asks for a chart or trend.
- For percentages set is_percent=true and express value as a number (e.g. 25.3 means 25.3%).
- Monetary values should use the same unit as the supplied data (billions USD).
- Period strings must exactly match those in the data (e.g. "FY2024", "Q2 2024").
- If data needed for a computation is missing, say so in explanation; omit that metric from ratios.
- Never invent data that is not in the supplied financial context."""


def compute_lab(
    question: str,
    company: str,
    period: str,
    ratios: dict,
    statements: dict,
    summary: str = "",
) -> dict:
    """
    Process a Lab request. Returns a structured dict with explanation,
    optional ratios list, and optional chart spec.
    Falls back gracefully when ANTHROPIC_API_KEY is absent.
    """
    if not question.strip():
        return {"explanation": "Please ask me to compute a metric or create a chart."}

    if not ANTHROPIC_API_KEY:
        return {
            "explanation": (
                "AI Lab requires an Anthropic API key. "
                "Set ANTHROPIC_API_KEY to enable this feature."
            )
        }

    try:
        import anthropic  # type: ignore

        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        context = _build_context(company, period, ratios, statements)
        if summary:
            context = f"Executive Summary:\n{summary}\n\n{context}"

        response = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=1200,
            system=_SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": (
                        f"Company: {company}\nPeriod: {period}\n\n"
                        f"Financial Data:\n{context}\n\n"
                        f"Request: {question}"
                    ),
                }
            ],
        )

        raw = response.content[0].text.strip()
        # Claude sometimes wraps JSON in markdown fences despite instructions.
        # Extract the outermost JSON object robustly.
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1:
            raw = raw[start : end + 1]
        result = json.loads(raw)
        # Ensure explanation is always present
        if "explanation" not in result:
            result["explanation"] = ""
        return result

    except json.JSONDecodeError:
        return {
            "explanation": (
                "I couldn't format that as structured data. "
                "Try rephrasing — for example: \"Chart gross profit vs operating income\" "
                "or \"Compute interest coverage ratio\"."
            )
        }
    except Exception as exc:
        return {"explanation": f"Error generating response: {exc}"}
