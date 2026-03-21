from fastapi import APIRouter, Query, HTTPException

from backend.src.services.extract_financials import extract_financials
from backend.src.services.build_response import build_financials_response
from backend.src.sec.filings import get_filings_list
from backend.src.ai.summarize import summarize_financials
from backend.src.chat.qa import answer_question

router = APIRouter()

# In-process cache: stores the last response context per ticker:form
# so the chat endpoint can answer without re-fetching.
_context_cache: dict[str, dict] = {}


@router.get("/financials")
def financials(
    ticker: str = Query(..., description="Ticker symbol, e.g. AAPL"),
    form: str = Query("10-K", description="10-K or 10-Q"),
):
    try:
        extracted = extract_financials(ticker.upper(), form.upper())

        # Build a temporary response (without summary) to pass statements to AI
        temp_response = build_financials_response(extracted, summary="")

        summary = summarize_financials(
            company=extracted["company"],
            period=temp_response["period"],
            ratios=extracted["ratios"],
            statements=temp_response["statements"],
            ticker=extracted["ticker"],
        )

        response = build_financials_response(extracted, summary=summary)

        # Cache context for chat
        cache_key = f"{ticker.upper()}:{form.upper()}"
        _context_cache[cache_key] = {
            "company": extracted["company"],
            "period": response["period"],
            "ratios": extracted["ratios"],
            "statements": response["statements"],
            "summary": summary,
        }

        return response

    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/filings")
def filings(
    ticker: str = Query(..., description="Ticker symbol, e.g. AAPL"),
):
    try:
        return get_filings_list(ticker.upper())
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/chat")
def chat(payload: dict):
    question = payload.get("question", "")
    ticker = payload.get("ticker", "").upper()
    form = payload.get("form", "10-K").upper()

    cache_key = f"{ticker}:{form}"
    ctx = _context_cache.get(cache_key)

    # If no cached context, try to fetch (slower path)
    if not ctx and ticker:
        try:
            extracted = extract_financials(ticker, form)
            temp = build_financials_response(extracted)
            ctx = {
                "company": extracted["company"],
                "period": temp["period"],
                "ratios": extracted["ratios"],
                "statements": temp["statements"],
                "summary": "",
            }
        except Exception:
            ctx = None

    if not ctx:
        return {
            "answer": "No financial data is loaded. Please search for a ticker first."
        }

    answer = answer_question(
        question=question,
        company=ctx["company"],
        period=ctx["period"],
        ratios=ctx["ratios"],
        statements=ctx["statements"],
        summary=ctx.get("summary", ""),
    )

    return {"answer": answer}
