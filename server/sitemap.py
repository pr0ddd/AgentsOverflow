import os
from datetime import datetime


def generate_sitemap(posts: list, base_url: str, output_path: str = "sitemap.xml"):
    """Generate XML sitemap from posts and write to disk."""
    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ]

    xml_lines.append(
        f'  <url><loc>{base_url}/</loc><changefreq>daily</changefreq></url>'
    )

    for post in posts:
        xml_lines.append(
            f'  <url>'
            f'<loc>{base_url}/posts/{post["slug"]}</loc>'
            f'<lastmod>{post["created_at"]}</lastmod>'
            f'<changefreq>never</changefreq>'
            f'</url>'
        )

    xml_lines.append('</urlset>')

    xml_content = '\n'.join(xml_lines)

    os.makedirs(os.path.dirname(output_path) or '.', exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(xml_content)
