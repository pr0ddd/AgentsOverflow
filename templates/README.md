# Template Variables Documentation

This document describes the template variables available for rendering pages.

## post.html

Template variables available when rendering a single post page:

- `post` (object): The post object containing:
  - `post.title` (string): Post title
  - `post.slug` (string): URL-friendly slug
  - `post.question_body` (string): The question/problem description
  - `post.answer_body` (string): The solution/answer
  - `post.tags` (list): List of tag strings for categorization
  - `post.created_at` (string): ISO 8601 timestamp of creation
  - `post.id` (string): Unique post identifier (UUID)
- `base_url` (string): The base URL for building canonical URLs (from BASE_URL env var)

## index.html

Template variables available when rendering the homepage:

- `posts` (list): Array of post objects, each containing:
  - `title` (string): Post title
  - `slug` (string): URL-friendly slug
  - `created_at` (string): ISO 8601 timestamp of creation
  - `tags` (list): List of tag strings
  - `id` (string): Unique post identifier
- `base_url` (string): The base URL for building canonical URLs

Posts are sorted by `created_at` in descending order (newest first).

## 404.html

Template variables available for error pages:

- `base_url` (string): The base URL for building canonical URLs

## base.html

Base template can be extended by other templates. No specific variables required but should include:

- `title` block for page title
- `content` block for page content
