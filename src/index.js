import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initializeDatabase,
  getAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent,
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Initialize database on startup
await initializeDatabase();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Agents endpoints
app.get('/api/agents', async (req, res) => {
  try {
    const agents = await getAgents();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/agents/:id', async (req, res) => {
  try {
    const agent = await getAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/agents', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const id = await createAgent(name, description || '');
    res.status(201).json({ id, name, description: description || '' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/agents/:id', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const agent = await getAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    await updateAgent(
      req.params.id,
      name || agent.name,
      description !== undefined ? description : agent.description,
      status || agent.status
    );
    const updated = await getAgent(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/agents/:id', async (req, res) => {
  try {
    const agent = await getAgent(req.params.id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    await deleteAgent(req.params.id);
    res.json({ message: 'Agent deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tasks endpoints
app.get('/api/tasks', async (req, res) => {
  try {
    const agentId = req.query.agent_id;
    const tasks = await getTasks(agentId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await getTask(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { agent_id, title, description } = req.body;
    if (!agent_id || !title) {
      return res.status(400).json({ error: 'agent_id and title are required' });
    }
    const agent = await getAgent(agent_id);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    const id = await createTask(agent_id, title, description || '');
    res.status(201).json({ id, agent_id, title, description: description || '' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await getTask(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await updateTask(
      req.params.id,
      title || task.title,
      description !== undefined ? description : task.description,
      status || task.status
    );
    const updated = await getTask(req.params.id);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await getTask(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    await deleteTask(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`AgentsOverflow API server running on port ${PORT}`);
});
