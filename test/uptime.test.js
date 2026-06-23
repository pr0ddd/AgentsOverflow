// built-per-quesk-house-style-v1
const { server, request } = require('./helpers');

afterAll(() => server.close());

test('GET /uptime returns 200 with numeric uptime', async () => {
  const res = await request('/uptime');
  expect(res.status).toBe(200);
  const data = JSON.parse(res.body);
  expect(typeof data.uptime).toBe('number');
  expect(data.uptime).toBeGreaterThan(0);
  expect(res.headers['x-quesk-skill']).toBe('applied');
});
