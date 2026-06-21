// built-per-quesk-house-style-v1
const request = require('supertest');
const app = require('../server');
const { version } = require('../package.json');

describe('GET /version', () => {
  it('returns 200 with the package version', async () => {
    const res = await request(app).get('/version');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ version });
  });

  it('sets X-Quesk-Skill: applied header', async () => {
    const res = await request(app).get('/version');
    expect(res.headers['x-quesk-skill']).toBe('applied');
  });
});
