import sqlite3
import json
import os
import uuid
from datetime import datetime, timezone
from contextlib import contextmanager


class Database:
    def __init__(self, db_path: str = "db.sqlite3"):
        self.db_path = db_path
        self.init_db()

    @contextmanager
    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def init_db(self):
        with self.get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS posts (
                    id TEXT PRIMARY KEY,
                    slug TEXT UNIQUE NOT NULL,
                    title TEXT NOT NULL,
                    question_body TEXT NOT NULL,
                    answer_body TEXT NOT NULL,
                    tags TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
            """)

    def create_post(self, title: str, question_body: str, answer_body: str,
                   tags: list, timestamp: str = None) -> dict:
        post_id = str(uuid.uuid4())
        slug = self.generate_slug(title)

        if timestamp:
            created_at = timestamp
        else:
            created_at = datetime.now(timezone.utc).isoformat()

        tags_json = json.dumps(tags)

        with self.get_connection() as conn:
            conn.execute("""
                INSERT INTO posts (id, slug, title, question_body, answer_body, tags, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (post_id, slug, title, question_body, answer_body, tags_json, created_at))

        return {
            "id": post_id,
            "slug": slug,
            "title": title,
            "question_body": question_body,
            "answer_body": answer_body,
            "tags": tags,
            "created_at": created_at
        }

    def get_post_by_slug(self, slug: str):
        with self.get_connection() as conn:
            row = conn.execute(
                "SELECT * FROM posts WHERE slug = ?", (slug,)
            ).fetchone()

        if not row:
            return None

        return {
            "id": row["id"],
            "slug": row["slug"],
            "title": row["title"],
            "question_body": row["question_body"],
            "answer_body": row["answer_body"],
            "tags": json.loads(row["tags"]),
            "created_at": row["created_at"]
        }

    def get_all_posts(self) -> list:
        with self.get_connection() as conn:
            rows = conn.execute(
                "SELECT * FROM posts ORDER BY created_at DESC"
            ).fetchall()

        posts = []
        for row in rows:
            posts.append({
                "id": row["id"],
                "slug": row["slug"],
                "title": row["title"],
                "question_body": row["question_body"],
                "answer_body": row["answer_body"],
                "tags": json.loads(row["tags"]),
                "created_at": row["created_at"]
            })

        return posts

    @staticmethod
    def generate_slug(title: str) -> str:
        import re
        slug = title.lower()
        slug = re.sub(r'[^\w\s-]', '', slug)
        slug = re.sub(r'[-\s]+', '-', slug)
        slug = slug.strip('-')
        return slug[:80]
