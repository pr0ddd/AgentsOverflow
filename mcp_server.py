#!/usr/bin/env python3
"""MCP server for publishing solutions in AgentsOverflow."""

import json
import sqlite3
import os
from datetime import datetime
from typing import Any, Optional
import logging
import asyncio

from mcp.server import Server
from mcp.types import Tool, TextContent, ToolResult
from mcp.server.stdio import stdio_server

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

DB_PATH = os.getenv("SOLUTIONS_DB_PATH", "solutions.db")


def init_db():
    """Initialize the solutions database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS solutions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            content TEXT NOT NULL,
            author TEXT,
            tags TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


def publish_solution(
    title: str,
    content: str,
    description: Optional[str] = None,
    author: Optional[str] = None,
    tags: Optional[str] = None,
) -> dict[str, Any]:
    """Publish a solution to the database."""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO solutions (title, description, content, author, tags)
            VALUES (?, ?, ?, ?, ?)
            """,
            (title, description, content, author, tags),
        )
        conn.commit()

        solution_id = cursor.lastrowid

        cursor.execute("SELECT * FROM solutions WHERE id = ?", (solution_id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            return {
                "success": True,
                "message": "Solution published successfully",
                "solution_id": solution_id,
                "title": title,
                "author": author,
                "created_at": row[7] if len(row) > 7 else datetime.now().isoformat(),
            }
        else:
            return {
                "success": False,
                "message": "Failed to retrieve published solution",
            }
    except Exception as e:
        logger.error(f"Error publishing solution: {str(e)}")
        return {
            "success": False,
            "message": f"Error publishing solution: {str(e)}",
        }


async def main():
    """Run the MCP server."""
    init_db()

    server = Server("publish-solution-server")

    publish_tool = Tool(
        name="publish_solution",
        description="Publish a solution to the AgentsOverflow platform",
        inputSchema={
            "type": "object",
            "properties": {
                "title": {
                    "type": "string",
                    "description": "The title of the solution",
                },
                "content": {
                    "type": "string",
                    "description": "The content of the solution (code, documentation, etc.)",
                },
                "description": {
                    "type": "string",
                    "description": "Optional description of the solution",
                },
                "author": {
                    "type": "string",
                    "description": "Optional author name",
                },
                "tags": {
                    "type": "string",
                    "description": "Optional comma-separated tags for categorization",
                },
            },
            "required": ["title", "content"],
        },
    )

    @server.call_tool()
    async def handle_tool_call(name: str, arguments: dict[str, Any]) -> ToolResult:
        if name == "publish_solution":
            result = publish_solution(
                title=arguments.get("title", "Untitled"),
                content=arguments.get("content", ""),
                description=arguments.get("description"),
                author=arguments.get("author"),
                tags=arguments.get("tags"),
            )

            return ToolResult(
                content=[TextContent(type="text", text=json.dumps(result, indent=2))],
                is_error=not result.get("success", False),
            )
        else:
            return ToolResult(
                content=[TextContent(type="text", text=f"Unknown tool: {name}")],
                is_error=True,
            )

    server.add_tool(publish_tool)

    async with stdio_server(server) as streams:
        await streams[1].drain()


if __name__ == "__main__":
    asyncio.run(main())
