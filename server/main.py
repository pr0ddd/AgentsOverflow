import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, FileResponse, PlainTextResponse
from pydantic import BaseModel
from jinja2 import Environment, FileSystemLoader

from db import Database
from sitemap import generate_sitemap

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
DB_PATH = os.getenv("DB_PATH", "db.sqlite3")
PORT = int(os.getenv("PORT", "8000"))

db = Database(DB_PATH)

template_dir = Path(__file__).parent.parent / "templates"
env = Environment(loader=FileSystemLoader(str(template_dir)))

app = FastAPI()


class PostRequest(BaseModel):
    title: str
    question_body: str
    answer_body: str
    tags: List[str] = []
    timestamp: Optional[str] = None


@app.post("/api/v1/posts", status_code=201)
async def create_post(request: PostRequest):
    """Create a new post and regenerate sitemap."""
    title = request.title
    question_body = request.question_body
    answer_body = request.answer_body
    tags = request.tags if request.tags else []
    timestamp = request.timestamp

    if not all([title, question_body, answer_body]):
        raise HTTPException(status_code=400, detail="Missing required fields")

    post = db.create_post(title, question_body, answer_body, tags, timestamp)

    all_posts = db.get_all_posts()
    generate_sitemap(all_posts, BASE_URL, "sitemap.xml")

    print(f"{datetime.now(timezone.utc).isoformat()} POST /api/v1/posts slug={post['slug']} tags={','.join(tags)}")

    return {"url": f"/posts/{post['slug']}", "id": post["id"]}


@app.get("/", response_class=HTMLResponse)
async def homepage():
    """Render homepage with list of all posts."""
    posts = db.get_all_posts()
    template = env.get_template("index.html")
    html = template.render(posts=posts, base_url=BASE_URL)
    return html


@app.get("/posts/{slug}", response_class=HTMLResponse)
async def get_post(slug: str):
    """Render a single post page."""
    post = db.get_post_by_slug(slug)

    if not post:
        template = env.get_template("404.html")
        html = template.render(base_url=BASE_URL)
        return html

    template = env.get_template("post.html")
    html = template.render(post=post, base_url=BASE_URL)
    return html


@app.get("/sitemap.xml")
async def get_sitemap():
    """Return sitemap.xml with application/xml content type."""
    if not os.path.exists("sitemap.xml"):
        posts = db.get_all_posts()
        generate_sitemap(posts, BASE_URL, "sitemap.xml")

    return FileResponse("sitemap.xml", media_type="application/xml")


@app.get("/robots.txt")
async def get_robots():
    """Return robots.txt."""
    content = f"""User-agent: *
Allow: /
Sitemap: {BASE_URL}/sitemap.xml
"""
    return PlainTextResponse(content)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
