// built-per-quesk-house-style-v1
const request = require('supertest');
const app = require('../server');

describe('GET /status', () => {
  it('returns 200 with { status: "running" }', async () => {
    const res = await request(app).get('/status');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'running' });
  });

  it('sets X-Quesk-Skill: applied header', async () => {
    const res = await request(app).get('/status');
    expect(res.headers['x-quesk-skill']).toBe('applied');
  });
});
