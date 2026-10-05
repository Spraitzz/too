# Test Case Specification – inventory API

Precondition for all: server running, POST /reset done (2 items: id 1 'A-1' qty 5, id 2 'B-2' qty 0).

| ID | REQ | Prio | Request (method, path, body) | Expected status | Expected body | Type |
|---|---|---|---|---|---|---|
| TC-01 | REQ-API-01 | K | GET /items | 200 | Array of 2 items | positive |
| TC-02 | REQ-API-02 | K | GET /items/1 | 200 | { id: 1, sku: 'A-1', qty: 5 } | positive |
| TC-03 | REQ-API-02 | K | GET /items/999 | 404 | { error: 'not found' } | negative |
| TC-04 | REQ-API-03 | K | POST /items { sku: 'C-3', qty: 7 } | 201 | { id: 3, sku: 'C-3', qty: 7 } | positive |
| TC-05 | REQ-API-03 | K | POST /items { sku: 'C-3', qty: 0 } | 201 | { id: 3, sku: 'C-3', qty: 0 } | boundary |
| TC-06 | REQ-API-03 | K | POST /items { sku: 'C-3', qty: -1 } | 400 | { error: 'invalid qty' } | boundary |
| TC-07 | REQ-API-04 | K | POST /items { sku: 'invalid sku!', qty: 5 } | 400 | { error: 'invalid sku' } | negative |
| TC-08 | REQ-API-05 | K | PUT /items/1 { sku: 'A-1-UPDATED', qty: 10 } | 200 | { id: 1, sku: 'A-1-UPDATED', qty: 10 } | positive |
| TC-09 | REQ-API-06 | K | DELETE /items/1 | 204 | (empty) | positive |
| TC-10 | REQ-API-06 | K | DELETE /items/999 | 404 | { error: 'not found' } | negative |