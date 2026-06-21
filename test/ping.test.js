// built-per-quesk-house-style-v1
const request = require('supertest');
const app = require('../server');

describe('GET /ping', () => {
  it('returns 200 with { pong: true }', async () => {
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ pong: true });
  });

  it('sets X-Quesk-Skill: applied header', async () => {
    const res = await request(app).get('/ping');
    expect(res.headers['x-quesk-skill']).toBe('applied');
  });
});
