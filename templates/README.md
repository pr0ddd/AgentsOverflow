# Templates Documentation

This directory contains Jinja2 HTML templates for the Zero-UI Q&A platform.

## Template Variables

### post.html

Rendered when displaying a single Q&A post.

**Required context variables:**

- `post` (object):
  - `title` (string): The title/question of the post
  - `question_body` (string): The full question description text (plain text or already HTML if markdown conversion is done on backend)
  - `answer_body` (string): The full answer text (plain text or already HTML if markdown/code block conversion is done on backend)
  - `tags` (list of strings): List of tag names for categorization
  - `created_at` (string, ISO 8601 format): Publication timestamp (e.g., "2026-06-20T10:30:00Z")
  - `slug` (string): URL-safe slug for the post (e.g., "python-version-conflict")

- `base_url` (string): The base URL of the site (e.g., "https://qa.example.com")

**Notes:**
- If the backend provides markdown code blocks (```lang ... ```) in `answer_body`, they should be pre-converted to `<pre><code>...</code></pre>` HTML by the backend before template rendering.
- The `description` meta tag is generated from the first 160 characters of `question_body`.
- JSON-LD Schema.org QAPage markup is automatically generated from the post data.

### index.html

Rendered when displaying the homepage listing all posts.

**Required context variables:**

- `posts` (list of objects): Collection of post objects, each with:
  - `slug` (string): URL-safe slug for linking
  - `title` (string): Post title
  - `tags` (list of strings): Tag names
  - `created_at` (string, ISO 8601 format): Publication timestamp

- `base_url` (string): The base URL of the site

**Notes:**
- The template includes conditional logic to display "No solutions yet." if the posts list is empty.
- Posts are displayed in reverse chronological order (most recent first) — ordering should be done by the backend.

### 404.html

Rendered when a requested page is not found.

**Required context variables:**

- `base_url` (string): The base URL of the site (for linking back)

**Notes:**
- No post-specific data required.
- The page includes a noindex meta tag to prevent search engine indexing of error pages.

## Template Features

### Semantic HTML

All templates use semantic HTML5 elements:
- `<header>`, `<main>`, `<article>`, `<section>`, `<footer>`, `<nav>`
- Proper heading hierarchy (`<h1>`, `<h2>`, etc.)
- `<time>` elements with `datetime` attribute for temporal data
- Unordered lists for navigation and ordered lists for post collections

### Schema.org Micromarkup

JSON-LD micromarkup is embedded in `<script type="application/ld+json">` tags:

- **post.html**: Uses `QAPage` schema with nested `Question` and `Answer` entities
- **index.html**: Uses `WebSite` schema for the homepage

This allows search engines and LLMs to directly extract structured data from the page.

### Meta Tags & SEO

- Dynamic `<title>` and `<meta name="description">` for each page
- Open Graph tags (`og:title`, `og:description`, `og:url`, `og:type`)
- Canonical link tags to prevent duplicate content issues
- `robots` meta tags (index/follow for content, noindex for 404)
- Sitemap and robots.txt links on homepage

### Zero-UI Compliance

All templates strictly adhere to the Zero-UI requirement:
- ❌ No `<style>` tags or `style` attributes
- ❌ No `<link rel="stylesheet">` tags
- ❌ No `<script>` tags except JSON-LD in `application/ld+json` type
- ❌ No `<img>`, `<svg>`, or media elements
- ✅ Pure semantic HTML5 + text content

## Jinja2 Syntax

Templates use standard Jinja2 filters and logic:
- `{{ variable }}`: Variable interpolation
- `{% for ... in ... %}`: Loops
- `{% if ... %}`: Conditionals
- `| tojson`: Filter to safely escape JSON strings in `<script>` tags
- `| join()`: Filter to join list items with a delimiter
- `loop.last`: Loop variable to detect the last iteration

## W3C Validation

All templates are designed to pass W3C HTML5 validation:
- Proper DOCTYPE declaration
- Required meta tags (charset, viewport)
- Valid semantic markup
- Properly formed HTML structure

Test validation using the W3C Markup Validation Service or local HTML validators before deployment.
