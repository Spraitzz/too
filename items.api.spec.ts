import { test, expect } from '@playwright/test';

// Каждый тест начинается с чистого состояния
test.beforeEach(async ({ request }) => {
  await request.post('/reset');
});

// TC-01 · REQ-API-01
test('TC-01 GET /items returns 200 and an array of 2 items', async ({ request }) => {
  const res = await request.get('/items');
  expect(res.status()).toBe(200);
  const data = await res.json();
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBe(2);
});

// TC-02 · REQ-API-02
test('TC-02 GET /items/1 returns 200 and the item', async ({ request }) => {
  const res = await request.get('/items/1');
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ id: 1, sku: 'A-1', qty: 5 });
});

// TC-03 · REQ-API-02 · tundmatu id -> 404
test('TC-03 GET /items/999 returns 404 with error body', async ({ request }) => {
  const res = await request.get('/items/999');
  expect(res.status()).toBe(404);
  expect(await res.json()).toEqual({ error: 'not found' });
});

// TC-04 · REQ-API-03
test('TC-04 POST /items with valid body returns 201 and created item', async ({ request }) => {
  const res = await request.post('/items', { data: { sku: 'C-3', qty: 7 } });
  expect(res.status()).toBe(201);
  expect(await res.json()).toEqual({ id: 3, sku: 'C-3', qty: 7 });
});

// TC-05 · REQ-API-03 · qty 0 (piirväärtus)
test('TC-05 POST /items with qty 0 returns 201 (boundary)', async ({ request }) => {
  const res = await request.post('/items', { data: { sku: 'C-3', qty: 0 } });
  expect(res.status()).toBe(201);
  expect(await res.json()).toEqual({ id: 3, sku: 'C-3', qty: 0 });
});

// TC-06 · REQ-API-03 · qty -1 -> 400 (piirväärtus)
test('TC-06 POST /items with qty -1 returns 400 (boundary)', async ({ request }) => {
  const res = await request.post('/items', { data: { sku: 'C-3', qty: -1 } });
  expect(res.status()).toBe(400);
  expect(await res.json()).toEqual({ error: 'invalid qty' });
});

// TC-07 · REQ-API-04
test('TC-07 POST /items with invalid sku returns 400', async ({ request }) => {
  const res = await request.post('/items', { data: { sku: 'invalid sku!', qty: 5 } });
  expect(res.status()).toBe(400);
  expect(await res.json()).toEqual({ error: 'invalid sku' });
});

// TC-08 · REQ-API-05
test('TC-08 PUT /items/1 updates and returns 200', async ({ request }) => {
  const res = await request.put('/items/1', { data: { sku: 'A-1-UPDATED', qty: 10 } });
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ id: 1, sku: 'A-1-UPDATED', qty: 10 });
});

// TC-09 · REQ-API-06
test('TC-09 DELETE /items/1 returns 204 without body', async ({ request }) => {
  const res = await request.delete('/items/1');
  expect(res.status()).toBe(204);
  expect(await res.text()).toBe('');
});

// TC-10 · REQ-API-06
test('TC-10 DELETE /items/999 returns 404', async ({ request }) => {
  const res = await request.delete('/items/999');
  expect(res.status()).toBe(404);
  expect(await res.json()).toEqual({ error: 'not found' });
});