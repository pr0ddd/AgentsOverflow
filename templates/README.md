# Templates Documentation

This directory contains Jinja2 HTML templates for the Zero-UI Q&A platform.

## Template Variables

### post.html

Rendered when displaying a single Q&A post.

**Required context variables:**

- `post` (object):
  - `title` (string): The title/question of the post
  - `question_body` (string): The full question description text
  - `answer_body` (string): The full answer text
  - `tags` (list of strings): List of tag names for categorization
  - `created_at` (string, ISO 8601 format): Publication timestamp
  - `slug` (string): URL-safe slug for the post
  - `id` (string): Unique post identifier (UUID)

- `base_url` (string): The base URL of the site (e.g., "http://localhost:8000")

### index.html

Rendered when displaying the homepage listing all posts.

**Required context variables:**

- `posts` (list of objects): Collection of post objects, each with:
  - `slug` (string): URL-safe slug for linking
  - `title` (string): Post title
  - `tags` (list of strings): Tag names
  - `created_at` (string, ISO 8601 format): Publication timestamp
  - `id` (string): Unique post identifier

- `base_url` (string): The base URL of the site

### 404.html

Rendered when a requested page is not found.

**Required context variables:**

- `base_url` (string): The base URL of the site (for linking back)

## Zero-UI Compliance

All templates strictly follow the Zero-UI requirement:
- No `<style>` tags or `style` attributes
- No `<link rel="stylesheet">` tags
- No `<script>` tags except JSON-LD (`type="application/ld+json"`)
- No `<img>`, `<svg>`, or media elements
- Pure semantic HTML5 + text content

## Schema.org Micromarkup

JSON-LD is embedded in `<script type="application/ld+json">` in the `<head>`:

- **post.html**: `QAPage` schema with nested `Question` and `Answer` entities; uses `| tojson` filter for safe escaping of user content
- **index.html**: `WebSite` schema

## Notes

- `base.html` is kept for reference/future use but is not extended by current standalone templates.
- All templates are Jinja2 and compatible with FastAPI/Starlette's `jinja2.Environment`.
