# Project Approach and Summary

## 1. What was your approach to tackle this project?
I approached the project by first breaking the requirement into clear backend responsibilities:
- design a RESTful API for order splitting
- accept portfolio allocation input and total amount
- calculate per-stock quantity and amount
- support market timing rules for execution
- keep the code modular and testable

I implemented the solution as a Node.js + Express + TypeScript service with a modular structure:
- routes for API endpoints
- controllers for request handling
- services for business logic
- validators for request validation
- utils for reusable calculations and market logic
- memory layer for in-memory order history

This approach made it easier to evolve the API, add tests, and keep logic separate from transport concerns.

## 2. What assumptions did you make?
I made the following assumptions while implementing the solution:
- The default stock price is $100 if no market price is provided.
- Market price passed in the request should take priority over the default price.
- Portfolio weights are relative allocations and should be normalized so they sum to 1.
- Quantity precision is configurable through an environment variable, with a default of 3 decimal places.
- Order history is in-memory only, so it does not persist across restarts.
- For market execution timing, weekends and non-market hours are treated as market-closed, and the next valid market open time is used.

## 3. What challenges did you face?
Some of the main challenges were:
- implementing the split logic so the total amount is distributed correctly across the portfolio
- handling rounding and decimal precision without breaking totals
- making the execution time logic work for weekends and non-market hours
- keeping the code organized while still satisfying the functional requirements
- ensuring test coverage for the core scenarios and edge cases

## 4. If we migrate the current code to production level, what changes need to be done?
To make this production-ready, I would recommend the following changes:
- Replace in-memory storage with a real database such as PostgreSQL or MongoDB.
- Add authentication and authorization if this API will be exposed externally.
- Add environment-based configuration for production secrets and marketplace rules.
- Add structured logging and monitoring (for example, Winston, OpenTelemetry, or application monitoring tools).
- Add proper error handling and standardized API error responses.
- Add rate limiting and request validation hardening.
- Add CI/CD pipeline and automated deployment workflow.
- Add Docker support for consistent deployment environments.
- Add persistence for historical orders and audit trails.
- Add integration tests and API contract tests.
- Consider using a proper scheduler or job queue if execution timing needs to be processed asynchronously.

## 5. How I used Copilot here for specific problems?
I used Copilot as a coding assistant throughout the project to:
- scaffold the Node.js + Express + TypeScript structure quickly
- split the logic into routes, controllers, services, validators, and utilities
- help write and refine TypeScript types and validation logic
- generate and improve test cases for business rules
- troubleshoot issues such as validator behavior, weekend scheduling logic, and response shape
- speed up documentation and README updates

Copilot helped reduce development time and made it easier to iterate on the implementation while keeping the codebase clean and maintainable.
