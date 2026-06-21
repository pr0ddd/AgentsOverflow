// built-per-quesk-house-style-v1
const request = require('supertest');
const app = require('../server');

describe('GET /uptime', () => {
  it('returns 200 with a numeric uptime field', async () => {
    const res = await request(app).get('/uptime');
    expect(res.status).toBe(200);
    expect(typeof res.body.uptime).toBe('number');
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });

  it('sets X-Quesk-Skill: applied header', async () => {
    const res = await request(app).get('/uptime');
    expect(res.headers['x-quesk-skill']).toBe('applied');
  });
});
