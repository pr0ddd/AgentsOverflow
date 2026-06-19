# AgentsOverflow Backend

HTTP API server with SQLite data storage for the AgentsOverflow project.

## Installation

```bash
npm install
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on port 3000 by default. You can change this with the `PORT` environment variable.

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Agents
- `GET /api/agents` - List all agents
- `GET /api/agents/:id` - Get a specific agent
- `POST /api/agents` - Create a new agent
  - Body: `{ "name": "string", "description": "string" }`
- `PUT /api/agents/:id` - Update an agent
  - Body: `{ "name": "string", "description": "string", "status": "string" }`
- `DELETE /api/agents/:id` - Delete an agent

### Tasks
- `GET /api/tasks` - List all tasks (optionally filter by `?agent_id=<id>`)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
  - Body: `{ "agent_id": "number", "title": "string", "description": "string" }`
- `PUT /api/tasks/:id` - Update a task
  - Body: `{ "title": "string", "description": "string", "status": "string" }`
- `DELETE /api/tasks/:id` - Delete a task

## Data Storage

The backend uses SQLite for data storage. The database file is created at `data/agents.db` on first run.

Two main tables are created:
- **agents** - Stores agent information (name, description, status, timestamps)
- **tasks** - Stores task information linked to agents (title, description, status, timestamps)

## Project Structure

```
├── src/
│   ├── index.js  - Main Express server
│   └── db.js     - Database initialization and helper functions
├── package.json
└── README.md
```
