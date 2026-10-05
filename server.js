const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Начальное состояние базы данных в памяти
let defaultItems = [
  { id: 1, sku: 'A-1', qty: 5 },
  { id: 2, sku: 'B-2', qty: 0 }
];

let items = JSON.parse(JSON.stringify(defaultItems));
let nextId = 3;

// Функция валидации SKU и QTY
function validateItem(sku, qty) {
  if (!sku || typeof sku !== 'string' || sku.length < 1 || sku.length > 20) {
    return 'invalid sku';
  }
  const skuRegex = /^[A-Za-z0-9-]+$/;
  if (!skuRegex.test(sku)) {
    return 'invalid sku';
  }
  
  // ВНИМАНИЕ: ЗДЕСЬ ДЕФЕКТ D-02!
  // По спецификации должно быть qty < 0, но написано qty < -1
  if (typeof qty !== 'number' || qty < -1) {
    return 'invalid qty';
  }

  return null;
}

// POST /reset - сброс к начальному состоянию
app.post('/reset', (req, res) => {
  items = JSON.parse(JSON.stringify(defaultItems));
  nextId = 3;
  res.status(200).json({ status: 'reset done' });
});

// GET /items - получить список всех товаров (REQ-API-01)
app.get('/items', (req, res) => {
  res.status(200).json(items);
});

// GET /items/:id - получить товар по id (REQ-API-02)
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find(i => i.id === id);

  // ВНИМАНИЕ: ЗДЕСЬ ДЕФЕКТ D-01!
  // Возвращает 200 OK с null вместо статуса 404
  if (!item) {
    return res.status(200).json(null);
  }

  res.status(200).json(item);
});

// POST /items - создать новый товар (REQ-API-03, REQ-API-04)
app.post('/items', (req, res) => {
  const { sku, qty } = req.body;
  const error = validateItem(sku, qty);

  if (error) {
    return res.status(400).json({ error });
  }

  const newItem = { id: nextId++, sku, qty };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT /items/:id - обновить товар (REQ-API-05)
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find(i => i.id === id);

  if (!item) {
    return res.status(404).json({ error: 'not found' });
  }

  const { sku, qty } = req.body;
  const error = validateItem(sku, qty);

  if (error) {
    return res.status(400).json({ error });
  }

  item.sku = sku;
  item.qty = qty;
  res.status(200).json(item);
});

// DELETE /items/:id - удалить товар (REQ-API-06)
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = items.findIndex(i => i.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'not found' });
  }

  items.splice(index, 1);

  // ВНИМАНИЕ: ЗДЕСЬ ДЕФЕКТ D-03!
  // Возвращает 200 OK c телом { deleted: true } вместо статуса 204 No Content
  res.status(200).json({ deleted: true });
});

// Запуск сервера
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;