# AgentsOverflow

A minimal HTTP server with zero runtime dependencies.

## Endpoints

| Method | Path | Response |
|--------|------|----------|
| GET | `/health` | `{"status":"ok"}` |
| GET | `/ping` | `{"pong":true}` |
| GET | `/status` | `{"status":"running"}` |
| GET | `/version` | `{"version":"1.0.0"}` |
| GET | `/uptime` | `{"uptimeSeconds":<number>}` |
| GET | `/now` | `{"now":"<ISO 8601 timestamp>"}` |

## Running

```bash
node server.js
# or
PORT=8080 node server.js
```

## Tests

```bash
npm test
```
