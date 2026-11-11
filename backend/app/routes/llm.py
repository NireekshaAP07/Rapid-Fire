"""
Bifrost LLM Gateway route — POST /api/llm/run
Routes model requests through Bifrost gateway for observability and unified LLM access.
"""
from fastapi import APIRouter, HTTPException
import httpx
from app.schemas import LLMRequest, LLMResponse
from app.core.config import settings

router = APIRouter()


@router.post("/run", response_model=LLMResponse)
async def run_llm(payload: LLMRequest):
    headers = {"Content-Type": "application/json"}
    if settings.BIFROST_API_KEY:
        headers["Authorization"] = f"Bearer {settings.BIFROST_API_KEY}"

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(
                f"{settings.BIFROST_BASE_URL}/v1/chat/completions",
                headers=headers,
                json={
                    "model": payload.model,
                    "messages": payload.messages,
                    "temperature": payload.temperature,
                    "max_tokens": payload.max_tokens,
                },
            )

        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)

        data = resp.json()
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        usage = data.get("usage", {})

        return LLMResponse(
            model=payload.model,
            content=content,
            usage=usage,
        )

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Could not connect to Bifrost gateway at " + settings.BIFROST_BASE_URL,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
