// built-per-quesk-house-style-v1
const { server, request } = require('./helpers');

afterAll(() => server.close());

test('GET /version returns 200 with version field', async () => {
  const res = await request('/version');
  expect(res.status).toBe(200);
  const data = JSON.parse(res.body);
  expect(data).toHaveProperty('version');
  expect(typeof data.version).toBe('string');
  expect(res.headers['x-quesk-skill']).toBe('applied');
});
