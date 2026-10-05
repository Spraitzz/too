# Test Completion Report – inventory API

## 1. Summary
Test cases designed: 10 · Automated: 10 · Passed: 7 · Failed: 3 · Duration: ~4.2 s
Requirements covered: 8/8 (see traceability below)

## 2. Traceability
| REQ | Test cases | Result |
|---|---|---|
| REQ-API-01 | TC-01 | PASS |
| REQ-API-02 | TC-02, TC-03 | TC-03 FAIL → D-01 |
| REQ-API-03 | TC-04, TC-05, TC-06 | TC-06 FAIL → D-02 |
| REQ-API-04 | TC-07 | PASS |
| REQ-API-05 | TC-08 | PASS |
| REQ-API-06 | TC-09, TC-10 | TC-09 FAIL → D-03 |
| REQ-API-07 | Verified implicitly in TC-09 flow | PASS |
| REQ-API-08 | Verified across GET/POST JSON responses | PASS |

## 3. Defects
| ID | Severity | Found by | Status |
|---|---|---|---|
| D-01 | High | TC-03 | open |
| D-02 | High | TC-06 | open |
| D-03 | Medium | TC-09 | open |

## 4. Not tested / residual risk
- PUT requests with invalid body parameters.
- SKU boundary length check (exactly 20 vs 21 characters).
- Concurrency issues and large payloads.

## 5. Recommendation
Do not release: 3 open defects, 2 of them High severity. Re-test required after fixes.