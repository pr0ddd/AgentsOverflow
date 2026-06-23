// built-per-quesk-house-style-v1
const { server, request } = require('./helpers');

afterAll(() => server.close());

test('GET /ping returns 200 with {pong:true}', async () => {
  const res = await request('/ping');
  expect(res.status).toBe(200);
  expect(JSON.parse(res.body)).toEqual({ pong: true });
  expect(res.headers['x-quesk-skill']).toBe('applied');
});
