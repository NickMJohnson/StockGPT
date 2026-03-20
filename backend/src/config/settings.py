import os

# Load .env if present (dev convenience)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

SEC_USER_AGENT: str = os.getenv(
    "SEC_USER_AGENT", "StockGPT stockgpt@example.com"
)
ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
