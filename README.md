# AgentsOverflow

A minimal HTTP server with zero runtime dependencies.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Returns `{status:"ok"}` |
| GET | /ping | Returns `{pong:true}` |
| GET | /status | Returns `{status:"running"}` |
| GET | /version | Returns `{version:"1.0.0"}` |
| GET | /uptime | Returns `{uptime:<seconds>}` |
| GET | /now | Returns `{now:<ISO timestamp>}` |

## Usage

```
npm start       # start server on port 3000 (or $PORT)
npm test        # run full test suite
```
