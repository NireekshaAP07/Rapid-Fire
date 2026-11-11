"""
Tavily Search route — POST /api/search
Uses the official tavily-python client.
Set TAVILY_API_KEY in your .env file.
"""
from fastapi import APIRouter, HTTPException
from app.schemas import SearchRequest, SearchResponse, SearchResult
from app.core.config import settings

router = APIRouter()


@router.post("/", response_model=SearchResponse)
async def search(payload: SearchRequest):
    if not settings.TAVILY_API_KEY:
        raise HTTPException(status_code=503, detail="TAVILY_API_KEY is not configured")

    try:
        from tavily import TavilyClient
        client = TavilyClient(api_key=settings.TAVILY_API_KEY)
        response = client.search(
            query=payload.query,
            search_depth=payload.search_depth,
            max_results=payload.max_results,
        )
        results = [
            SearchResult(
                title=r.get("title", ""),
                url=r.get("url", ""),
                content=r.get("content", ""),
                score=r.get("score"),
            )
            for r in response.get("results", [])
        ]
        return SearchResponse(query=payload.query, results=results)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
