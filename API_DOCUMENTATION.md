# FINEDGE API Documentation

## Table of Contents
1. [Health Check](#health-check)
2. [Authentication](#authentication)
3. [Transactions](#transactions)
4. [Budget](#budget)
5. [Summary](#summary)

---

## Health Check

### Check API Health Status
- **Endpoint:** `GET /health`
- **Authentication:** Not required
- **Description:** Check if the API server is running and healthy

#### Example Request
```bash
curl -X GET http://localhost:8080/health
```

#### Example Response
```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---

## Authentication

### User Registration
- **Endpoint:** `POST /users`
- **Authentication:** Not required
- **Description:** Register a new user account

#### Request Header
```json
{
  "Content-Type": "application/json"
}
```

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "preferences": {
    "currency": "USD",
    "notifications": true
  }
}
```

#### Example Request
```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "preferences": {
      "currency": "USD",
      "notifications": true
    }
  }'
```

#### Example Response (Success - 201)
```json
{
  "success": true,
  "messgae": "user registered successfully"
}
```

#### Example Response (Error - 400)
```json
{
  "success": false,
  "message": "user already register with email: john@example.com"
}
```

---

### User Login
- **Endpoint:** `POST /users/login`
- **Authentication:** Not required
- **Description:** Authenticate user and receive JWT token

#### Request Body
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Example Request
```bash
curl -X POST http://localhost:8080/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

#### Example Response (Success - 200)
```json
{
  "success": true,
  "messgae": "user login successfully",
  "user": {
    "_id": "65a4f5b8c3d2e1a9b4f8c9e1",
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": {
      "currency": "USD",
      "notifications": true
    }
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWE0ZjViOGMzZDJlMWE5YjRmOGM5ZTEiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJpYXQiOjE3MDU3MzQwMDB9"
}
```

#### Example Response (Error - 400)
```json
{
  "success": false,
  "message": "please provide correct credentials"
}
```

---

## Transactions

### Create Transaction
- **Endpoint:** `POST /transactions`
- **Authentication:** Required (Bearer Token)
- **Description:** Create a new income or expense transaction

#### Request Header
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

#### Request Body
```json
{
  "type": "expense",
  "category": "groceries",
  "amount": 50.75
}
```

#### Example Request
```bash
curl -X POST http://localhost:8080/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "expense",
    "category": "groceries",
    "amount": 50.75
  }'
```

#### Example Response (Success - 200)
```json
{
  "_id": "65a4f5b8c3d2e1a9b4f8c9e2",
  "userId": "65a4f5b8c3d2e1a9b4f8c9e1",
  "type": "expense",
  "category": "groceries",
  "amount": 50.75,
  "date": "2024-01-16T10:30:00.000Z",
  "__v": 0
}
```

---

### Get All Transactions
- **Endpoint:** `GET /transactions`
- **Authentication:** Required (Bearer Token)
- **Description:** Retrieve all transactions for the authenticated user

#### Request Header
```json
{
  "Authorization": "Bearer <token>"
}
```

#### Example Request
```bash
curl -X GET http://localhost:8080/transactions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Example Response (Success - 200)
```json
{
  "success": true,
  "message": "Transactions fetched Successfully",
  "transactions": [
    {
      "_id": "65a4f5b8c3d2e1a9b4f8c9e2",
      "userId": "65a4f5b8c3d2e1a9b4f8c9e1",
      "type": "expense",
      "category": "groceries",
      "amount": 50.75,
      "date": "2024-01-16T10:30:00.000Z"
    },
    {
      "_id": "65a4f5b8c3d2e1a9b4f8c9e3",
      "userId": "65a4f5b8c3d2e1a9b4f8c9e1",
      "type": "income",
      "category": "salary",
      "amount": 3000,
      "date": "2024-01-15T09:00:00.000Z"
    }
  ]
}
```

---

### Get Single Transaction
- **Endpoint:** `GET /transactions/:id`
- **Authentication:** Required (Bearer Token)
- **Description:** Retrieve a specific transaction by ID

#### Request Parameter
| Parameter | Type   | Description           |
|-----------|--------|----------------------|
| id        | String | Transaction ID (MongoDB ObjectId) |

#### Example Request
```bash
curl -X GET http://localhost:8080/transactions/65a4f5b8c3d2e1a9b4f8c9e2 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Example Response (Success - 200)
```json
{
  "success": true,
  "message": "Transaction fetched Successfully",
  "transaction": {
    "_id": "65a4f5b8c3d2e1a9b4f8c9e2",
    "userId": "65a4f5b8c3d2e1a9b4f8c9e1",
    "type": "expense",
    "category": "groceries",
    "amount": 50.75,
    "date": "2024-01-16T10:30:00.000Z"
  }
}
```

#### Example Response (Error - 404)
```json
{
  "success": false,
  "message": "Transaction not found"
}
```

---

### Filter Transactions
- **Endpoint:** `GET /transactions/filter`
- **Authentication:** Required (Bearer Token)
- **Description:** Retrieve transactions with filters (category, date range)

#### Query Parameters
| Parameter | Type   | Description           | Required |
|-----------|--------|----------------------|----------|
| category  | String | Filter by category   | No       |
| startDate | Date   | Filter from date (ISO format) | No |
| endDate   | Date   | Filter to date (ISO format)   | No |

#### Example Request
```bash
curl -X GET "http://localhost:8080/transactions/filter?category=groceries&startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Example Response (Success - 200)
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65a4f5b8c3d2e1a9b4f8c9e2",
      "userId": "65a4f5b8c3d2e1a9b4f8c9e1",
      "type": "expense",
      "category": "groceries",
      "amount": 50.75,
      "date": "2024-01-16T10:30:00.000Z"
    },
    {
      "_id": "65a4f5b8c3d2e1a9b4f8c9e4",
      "userId": "65a4f5b8c3d2e1a9b4f8c9e1",
      "type": "expense",
      "category": "groceries",
      "amount": 75.50,
      "date": "2024-01-20T15:45:00.000Z"
    }
  ]
}
```

---

### Update Transaction
- **Endpoint:** `PATCH /transactions/:id`
- **Authentication:** Required (Bearer Token)
- **Description:** Update an existing transaction (amount, type, or category)

#### Request Parameter
| Parameter | Type   | Description           |
|-----------|--------|----------------------|
| id        | String | Transaction ID (MongoDB ObjectId) |

#### Request Body (Any of the following fields)
```json
{
  "type": "income",
  "category": "salary",
  "amount": 100.50
}
```

#### Example Request
```bash
curl -X PATCH http://localhost:8080/transactions/65a4f5b8c3d2e1a9b4f8c9e2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "amount": 75.50,
    "category": "clothing"
  }'
```

#### Example Response (Success - 200)
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "transaction": {
    "_id": "65a4f5b8c3d2e1a9b4f8c9e2",
    "userId": "65a4f5b8c3d2e1a9b4f8c9e1",
    "type": "expense",
    "category": "clothing",
    "amount": 75.50,
    "date": "2024-01-16T10:30:00.000Z"
  }
}
```

#### Example Response (Error - 400)
```json
{
  "success": false,
  "message": "Transaction not found"
}
```

---

### Delete Transaction
- **Endpoint:** `DELETE /transactions/:id`
- **Authentication:** Required (Bearer Token)
- **Description:** Delete a transaction by ID

#### Request Parameter
| Parameter | Type   | Description           |
|-----------|--------|----------------------|
| id        | String | Transaction ID (MongoDB ObjectId) |

#### Example Request
```bash
curl -X DELETE http://localhost:8080/transactions/65a4f5b8c3d2e1a9b4f8c9e2 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Example Response (Success - 200)
```json
{
  "success": true,
  "message": "transaction deleted Successfully"
}
```

#### Example Response (Error - 400)
```json
{
  "success": false,
  "message": "Transaction not found"
}
```

---

## Budget

### Create or Update Budget
- **Endpoint:** `POST /budget`
- **Authentication:** Required (Bearer Token)
- **Description:** Create a new budget or update existing budget (upsert operation)

#### Request Header
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

#### Request Body
```json
{
  "monthlyGoal": 5000,
  "savingsTarget": 1000
}
```

#### Example Request
```bash
curl -X POST http://localhost:8080/budget \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "monthlyGoal": 5000,
    "savingsTarget": 1000
  }'
```

#### Example Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "_id": "65a4f5b8c3d2e1a9b4f8c9e5",
    "user": "65a4f5b8c3d2e1a9b4f8c9e1",
    "monthlyGoal": 5000,
    "savingsTarget": 1000,
    "createdAt": "2024-01-16T10:30:00.000Z",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
}
```

#### Example Response (Error - 400)
```json
{
  "success": false,
  "message": "monthlyGoal must be greater than 0"
}
```

---

### Get Budget
- **Endpoint:** `GET /budget`
- **Authentication:** Required (Bearer Token)
- **Description:** Retrieve the current user's budget information

#### Request Header
```json
{
  "Authorization": "Bearer <token>"
}
```

#### Example Request
```bash
curl -X GET http://localhost:8080/budget \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Example Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "_id": "65a4f5b8c3d2e1a9b4f8c9e5",
    "user": "65a4f5b8c3d2e1a9b4f8c9e1",
    "monthlyGoal": 5000,
    "savingsTarget": 1000,
    "createdAt": "2024-01-16T10:30:00.000Z",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
}
```

---

### Get Budget Report
- **Endpoint:** `GET /budget/report`
- **Authentication:** Required (Bearer Token)
- **Description:** Get a detailed budget report with analysis and progress

#### Request Header
```json
{
  "Authorization": "Bearer <token>"
}
```

#### Example Request
```bash
curl -X GET http://localhost:8080/budget/report \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Example Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "monthlyGoal": 5000,
    "savingsTarget": 1000,
    "totalIncome": 3500,
    "totalExpense": 2500,
    "balance": 1000,
    "savingsPercentage": 28.5,
    "budgetStatus": "On Track"
  }
}
```

---

## Summary

### Get Income and Expense Summary
- **Endpoint:** `GET /summary`
- **Authentication:** Required (Bearer Token)
- **Description:** Get total income and expense summary for the user. Results are cached for 15 seconds.

#### Request Header
```json
{
  "Authorization": "Bearer <token>"
}
```

#### Example Request
```bash
curl -X GET http://localhost:8080/summary \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Example Response (Success - 200, From Cache)
```json
{
  "success": true,
  "source": "cache",
  "income": 3500,
  "expense": 2500
}
```

#### Example Response (Success - 200, From Database)
```json
{
  "success": true,
  "source": "DB",
  "income": 3500,
  "expense": 2500
}
```

---

### Get Monthly Trends
- **Endpoint:** `GET /summary/montly-trend`
- **Authentication:** Required (Bearer Token)
- **Description:** Get monthly income, expense, and balance trends for analysis

#### Request Header
```json
{
  "Authorization": "Bearer <token>"
}
```

#### Example Request
```bash
curl -X GET http://localhost:8080/summary/montly-trend \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

#### Example Response (Success - 200)
```json
{
  "success": true,
  "message": "Monthly trend report fetched successfully.",
  "data": [
    {
      "year": 2023,
      "month": 12,
      "income": 3000,
      "expense": 2000,
      "balance": 1000
    },
    {
      "year": 2024,
      "month": 1,
      "income": 3500,
      "expense": 2500,
      "balance": 1000
    },
    {
      "year": 2024,
      "month": 2,
      "income": 4000,
      "expense": 2800,
      "balance": 1200
    }
  ]
}
```

---

## Authentication Notes

- All endpoints marked as "Authentication Required" need a JWT token in the Authorization header
- Token format: `Authorization: Bearer <token>`
- Get a token by logging in using the `/users/login` endpoint
- Token is valid based on the expiration set in JWT config

## Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting on all endpoints to prevent abuse. Check response headers for rate limit information.

## Base URL

```
http://localhost:8080
```

Change the host and port based on your deployment configuration.
