import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../data', 'agents.db');

const db = new sqlite3.Database(dbPath);

const run = promisify(db.run.bind(db));
const get = promisify(db.get.bind(db));
const all = promisify(db.all.bind(db));

export async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agent_id) REFERENCES agents(id)
    )
  `);
}

export async function getAgents() {
  return await all('SELECT * FROM agents ORDER BY created_at DESC');
}

export async function getAgent(id) {
  return await get('SELECT * FROM agents WHERE id = ?', [id]);
}

export async function createAgent(name, description) {
  const result = await run(
    'INSERT INTO agents (name, description) VALUES (?, ?)',
    [name, description]
  );
  return result.lastID;
}

export async function updateAgent(id, name, description, status) {
  await run(
    'UPDATE agents SET name = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description, status, id]
  );
}

export async function deleteAgent(id) {
  await run('DELETE FROM agents WHERE id = ?', [id]);
}

export async function getTasks(agentId) {
  if (agentId) {
    return await all('SELECT * FROM tasks WHERE agent_id = ? ORDER BY created_at DESC', [agentId]);
  }
  return await all('SELECT * FROM tasks ORDER BY created_at DESC');
}

export async function getTask(id) {
  return await get('SELECT * FROM tasks WHERE id = ?', [id]);
}

export async function createTask(agentId, title, description) {
  const result = await run(
    'INSERT INTO tasks (agent_id, title, description) VALUES (?, ?, ?)',
    [agentId, title, description]
  );
  return result.lastID;
}

export async function updateTask(id, title, description, status) {
  await run(
    'UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, description, status, id]
  );
}

export async function deleteTask(id) {
  await run('DELETE FROM tasks WHERE id = ?', [id]);
}

export default db;
