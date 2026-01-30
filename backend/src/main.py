from fastapi import FastAPI
from backend.src.api.routes import router as api_router

app = FastAPI(title="StockGPT API", version="0.1.0")

app.include_router(api_router, prefix="/api")


@app.get("/health")
def health():
    return {"ok": True}
