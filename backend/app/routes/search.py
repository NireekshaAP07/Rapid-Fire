"""
Tavily Search route — POST /api/search
Uses the official tavily-python client.
Set TAVILY_API_KEY in your .env file.
"""
from fastapi import APIRouter, HTTPException
from app.schemas import SearchRequest, SearchResponse, SearchResult
from app.core.config import settings

router = APIRouter()


@router.post("", response_model=SearchResponse)
@router.post("/", response_model=SearchResponse, include_in_schema=False)
async def search(payload: SearchRequest):
    api_key = settings.get_tavily_key()
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="TAVILY_API_KEY is missing. Set it in backend/.env or the environment, then restart the backend.",
        )

    try:
        from tavily import AsyncTavilyClient, InvalidAPIKeyError, UsageLimitExceededError
    except ImportError as exc:
        raise HTTPException(
            status_code=503,
            detail="The Tavily client is not installed. Install backend/requirements.txt and restart the backend.",
        ) from exc

    try:
        async with AsyncTavilyClient(api_key=api_key) as client:
            response = await client.search(
                query=payload.query,
                search_depth=payload.search_depth,
                max_results=payload.max_results,
                timeout=20,
            )
    except InvalidAPIKeyError as exc:
        raise HTTPException(
            status_code=503,
            detail="Tavily rejected the configured API key. Check TAVILY_API_KEY in backend/.env.",
        ) from exc
    except UsageLimitExceededError as exc:
        raise HTTPException(
            status_code=429,
            detail="The Tavily API usage limit has been reached.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Tavily search failed. Check the backend network connection and API key.",
        ) from exc

    results = [
        SearchResult(
            title=result.get("title", ""),
            url=result.get("url", ""),
            content=result.get("content", ""),
            score=result.get("score"),
        )
        for result in response.get("results", [])
    ]
    return SearchResponse(query=payload.query, results=results)
