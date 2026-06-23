# AgentsOverflow

A minimal Node.js HTTP server with zero runtime dependencies.

## Endpoints

| Method | Path       | Response                              |
|--------|------------|---------------------------------------|
| GET    | /health    | `{"status":"ok"}`                     |
| GET    | /ping      | `{"pong":true}`                       |
| GET    | /status    | `{"status":"running"}`                |
| GET    | /version   | `{"version":"1.0.0"}`                 |
| GET    | /uptime    | `{"uptime":<seconds>}`                |
| GET    | /now       | `{"now":"<ISO timestamp>"}`           |

All responses include the `X-Quesk-Skill: applied` header and return `Content-Type: application/json`.

## Usage

```
npm start       # start server on port 3000 (or $PORT)
npm test        # run full test suite
```
