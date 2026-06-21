// built-per-quesk-house-style-v1
const request = require('supertest');
const app = require('../server');

describe('GET /health', () => {
  it('returns 200 with { status: "ok" }', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('sets X-Quesk-Skill: applied header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-quesk-skill']).toBe('applied');
  });
});
