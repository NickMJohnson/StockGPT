from fastapi import APIRouter, Query
from backend.src.api.schemas import FinancialsResponse
from backend.src.services.financials import get_financials_stub

router = APIRouter()


@router.get("/financials", response_model=FinancialsResponse)
def financials(
    ticker: str = Query(..., description="Ticker symbol (e.g., AAPL)"),
    form: str = Query("10-K", description="10-K or 10-Q"),
):
    # Later: replace with real SEC fetch+parse pipeline.
    return get_financials_stub(ticker=ticker.upper(), form=form)


@router.post("/chat")
def chat(payload: dict):
    # Later: replace with a real RAG/chat service over extracted statements.
    question = payload.get("question", "")
    return {
        "answer": f"(stub) You asked: {question}. Wire this to backend/src/chat/qa.py later."
    }
