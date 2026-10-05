# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: items.api.spec.ts >> TC-06 POST /items with qty -1 returns 400 (boundary)
- Location: items.api.spec.ts:46:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 201
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // Каждый тест начинается с чистого состояния
  4  | test.beforeEach(async ({ request }) => {
  5  |   await request.post('/reset');
  6  | });
  7  | 
  8  | // TC-01 · REQ-API-01
  9  | test('TC-01 GET /items returns 200 and an array of 2 items', async ({ request }) => {
  10 |   const res = await request.get('/items');
  11 |   expect(res.status()).toBe(200);
  12 |   const data = await res.json();
  13 |   expect(Array.isArray(data)).toBe(true);
  14 |   expect(data.length).toBe(2);
  15 | });
  16 | 
  17 | // TC-02 · REQ-API-02
  18 | test('TC-02 GET /items/1 returns 200 and the item', async ({ request }) => {
  19 |   const res = await request.get('/items/1');
  20 |   expect(res.status()).toBe(200);
  21 |   expect(await res.json()).toEqual({ id: 1, sku: 'A-1', qty: 5 });
  22 | });
  23 | 
  24 | // TC-03 · REQ-API-02 · tundmatu id -> 404
  25 | test('TC-03 GET /items/999 returns 404 with error body', async ({ request }) => {
  26 |   const res = await request.get('/items/999');
  27 |   expect(res.status()).toBe(404);
  28 |   expect(await res.json()).toEqual({ error: 'not found' });
  29 | });
  30 | 
  31 | // TC-04 · REQ-API-03
  32 | test('TC-04 POST /items with valid body returns 201 and created item', async ({ request }) => {
  33 |   const res = await request.post('/items', { data: { sku: 'C-3', qty: 7 } });
  34 |   expect(res.status()).toBe(201);
  35 |   expect(await res.json()).toEqual({ id: 3, sku: 'C-3', qty: 7 });
  36 | });
  37 | 
  38 | // TC-05 · REQ-API-03 · qty 0 (piirväärtus)
  39 | test('TC-05 POST /items with qty 0 returns 201 (boundary)', async ({ request }) => {
  40 |   const res = await request.post('/items', { data: { sku: 'C-3', qty: 0 } });
  41 |   expect(res.status()).toBe(201);
  42 |   expect(await res.json()).toEqual({ id: 3, sku: 'C-3', qty: 0 });
  43 | });
  44 | 
  45 | // TC-06 · REQ-API-03 · qty -1 -> 400 (piirväärtus)
  46 | test('TC-06 POST /items with qty -1 returns 400 (boundary)', async ({ request }) => {
  47 |   const res = await request.post('/items', { data: { sku: 'C-3', qty: -1 } });
> 48 |   expect(res.status()).toBe(400);
     |                        ^ Error: expect(received).toBe(expected) // Object.is equality
  49 |   expect(await res.json()).toEqual({ error: 'invalid qty' });
  50 | });
  51 | 
  52 | // TC-07 · REQ-API-04
  53 | test('TC-07 POST /items with invalid sku returns 400', async ({ request }) => {
  54 |   const res = await request.post('/items', { data: { sku: 'invalid sku!', qty: 5 } });
  55 |   expect(res.status()).toBe(400);
  56 |   expect(await res.json()).toEqual({ error: 'invalid sku' });
  57 | });
  58 | 
  59 | // TC-08 · REQ-API-05
  60 | test('TC-08 PUT /items/1 updates and returns 200', async ({ request }) => {
  61 |   const res = await request.put('/items/1', { data: { sku: 'A-1-UPDATED', qty: 10 } });
  62 |   expect(res.status()).toBe(200);
  63 |   expect(await res.json()).toEqual({ id: 1, sku: 'A-1-UPDATED', qty: 10 });
  64 | });
  65 | 
  66 | // TC-09 · REQ-API-06
  67 | test('TC-09 DELETE /items/1 returns 204 without body', async ({ request }) => {
  68 |   const res = await request.delete('/items/1');
  69 |   expect(res.status()).toBe(204);
  70 |   expect(await res.text()).toBe('');
  71 | });
  72 | 
  73 | // TC-10 · REQ-API-06
  74 | test('TC-10 DELETE /items/999 returns 404', async ({ request }) => {
  75 |   const res = await request.delete('/items/999');
  76 |   expect(res.status()).toBe(404);
  77 |   expect(await res.json()).toEqual({ error: 'not found' });
  78 | });
```