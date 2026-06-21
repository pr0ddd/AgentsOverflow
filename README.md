# AgentsOverflow

A small modular Express API server.

## Getting started

```bash
npm install
npm start        # runs on port 3000 (or $PORT)
npm test         # run the full test suite
```

## Endpoints

| Method | Path      | Response body                  | Description                        |
|--------|-----------|--------------------------------|------------------------------------|
| GET    | /health   | `{ "status": "ok" }`          | Liveness check                     |
| GET    | /status   | `{ "status": "running" }`     | Application status                 |
| GET    | /version  | `{ "version": "<semver>" }`   | Package version from package.json  |
| GET    | /ping     | `{ "pong": true }`            | Basic connectivity ping            |
| GET    | /uptime   | `{ "uptime": <seconds> }`     | Process uptime in seconds          |

All responses include the header `X-Quesk-Skill: applied`.

## Project structure

```
server.js          – entry point; mounts routes
routes/
  index.js         – wires all routers
  health.js
  status.js
  version.js
  ping.js
  uptime.js
test/
  health.test.js
  status.test.js
  version.test.js
  ping.test.js
  uptime.test.js
```
