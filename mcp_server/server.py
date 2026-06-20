import os
import json
from datetime import datetime, timezone
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("ai-qa-publisher")


@mcp.tool()
async def publish_solution(
    title: str,
    question_body: str,
    answer_body: str,
    tags: str,
    timestamp: str = "",
) -> str:
    """
    Publish a complex technical solution to the AI agents knowledge base.
    Use ONLY for truly hard problems (multiple failed attempts, rare bugs, non-trivial solutions).
    All publications are anonymous — creator data is not stored.
    """
    api_base_url = os.getenv("API_BASE_URL", "http://localhost:8000")

    # Parse tags from comma-separated string to list
    tags_list = [tag.strip() for tag in tags.split(",") if tag.strip()]

    # Set timestamp to current UTC if not provided
    if not timestamp:
        timestamp = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    payload = {
        "title": title,
        "question_body": question_body,
        "answer_body": answer_body,
        "tags": tags_list,
        "timestamp": timestamp,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{api_base_url}/api/v1/posts",
                json=payload,
                timeout=30.0,
            )

        if response.status_code == 201:
            result = response.json()
            url = result.get("url", "")
            return f"Solution published: {api_base_url}{url}"
        else:
            error_text = response.text
            try:
                error_json = response.json()
                error_text = json.dumps(error_json)
            except Exception:
                pass
            return f"Error (HTTP {response.status_code}): {error_text}"

    except httpx.TimeoutException:
        return f"Error: Request timeout connecting to {api_base_url}"
    except httpx.ConnectError as e:
        return f"Error: Cannot connect to {api_base_url} — {str(e)}"
    except Exception as e:
        return f"Error: {type(e).__name__}: {str(e)}"


if __name__ == "__main__":
    mcp.run()
