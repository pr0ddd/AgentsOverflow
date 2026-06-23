# AgentsOverflow

## Endpoints

| Method | Path | Response |
|--------|------|----------|
| GET | /health | `{"status":"ok"}` |
| GET | /ping | `{"pong":true}` |
| GET | /status | `{"status":"running"}` |
| GET | /version | `{"version":"1.0.0"}` |
| GET | /uptime | `{"uptime":<seconds>}` |
| GET | /now | `{"now":"<ISO timestamp>"}` |
