# stock-order-spiltter-REST-servies
REST API for stock order splitter based on a model portfolio.

## Features
- RESTful API using Express and TypeScript
- Modular code structure with controllers, services, routes, validators, and middleware
- In-memory order history (data does not survive restart)
- Configurable share quantity decimal precision via `DECIMAL_PLACES`
- Fixed default stock price of $100, with optional `marketPrice` override per symbol
- Response time logging in milliseconds

## Project structure
```
src/
 ├── app.ts
 ├── server.ts
 ├── config/
 │   └── index.ts
 ├── controllers/
 │   └── orderController.ts
 ├── routes/
 │   └── orderRoutes.ts
 ├── services/
 │   └── orderService.ts
 ├── validators/
 │   └── orderValidator.ts
 ├── models/
 │   └── order.ts
 ├── middlewares/
 │   └── timedLogger.ts
 ├── utils/
 │   └── quantity.ts
 ├── memory/
 │   └── orderMemory.ts
 └── tests/
     └── README.md
```

### Why this split?
- `server.ts` starts the app and binds the port.
- `app.ts` wires middleware and routes.
- `routes/` defines REST paths and delegates to controllers.
- `controllers/` handle HTTP request validation and response formatting.
- `services/` contain core business logic and order calculations.
- `validators/` define request schema validation with Zod.
- `models/` define shared TypeScript types.
- `middlewares/` house reusable Express middleware.
- `utils/` offer small helper functions.
- `config/` centralizes environment-based settings.
- `memory/` keeps in-memory persistence separate from business logic.

## Endpoints
### POST /orders
Create an order calculation for a model portfolio.

Request body:
```json
{
  "orderType": "BUY",
  "totalAmount": 10000,
  "modelPortfolio": [
    { "symbol": "AAPL", "weight": 0.5 },
    { "symbol": "MSFT", "weight": 0.3, "marketPrice": 101.25 },
    { "symbol": "GOOG", "weight": 0.2 }
  ]
}
```

Response body:
```json
{
  "id": "...",
  "orderType": "BUY",
  "totalAmount": 10000,
  "decimalPlaces": 3,
  "createdAt": "...",
  "fixedPrice": 100,
  "items": [
    {
      "symbol": "AAPL",
      "price": 100,
      "quantity": 50,
      "amount": 5000,
      "marketPriceUsed": false,
      "executeAt": "..."
    }
  ]
}
```

### GET /orders
Return all historic calculated orders stored in memory during the app runtime.

Response body:
```json
{
  "count": 1,
  "orders": [ ... ]
}
```

## Configuration
- `DECIMAL_PLACES` controls how many decimal places are allowed when computing share quantities.
- `PORT` sets the server port.

Use `.env.example` as a template for local configuration.

## Run locally
```bash
npm install
npm run dev
```

Build and run production output:
```bash
npm run build
npm start
```
