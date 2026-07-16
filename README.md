# GearUp

> Rent sports and outdoor gear instantly.

[Live API](https://gearup-backend-omega.vercel.app/)

GearUp is a modern backend API for a sports and outdoor gear rental platform. It supports customers who want to rent equipment, providers who manage inventory and orders, and admins who oversee users, categories, and platform activity.

## Overview

GearUp is built with Express, TypeScript, Prisma, PostgreSQL, and Stripe. The API provides authentication, role-based access control, gear inventory management, rental order workflows, payments, reviews, and administrative management endpoints.

## Roles

| Role | Purpose | Key Abilities |
| --- | --- | --- |
| Customer | Rents gear | Browse gear, place rental orders, pay, track order status, leave reviews, manage profile |
| Provider | Manages inventory | Create and maintain gear listings, view incoming orders, update rental status |
| Admin | Oversees the platform | Manage users, categories, listings, and all rental orders |

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Stripe Payments
- JWT Authentication
- bcryptjs
- cookie-parser
- CORS

## Features

### Public

- Browse all gear listings
- Search gear by category, brand, availability, and other filters
- View gear details and reviews
- View available categories

### Customer

- Register and log in as a customer
- Create rental orders for available gear
- Pay for confirmed rentals through Stripe checkout
- View payment history and payment details
- Track personal rental orders
- Create, update, and delete reviews for rented gear
- Update profile information

### Provider

- Register and log in as a provider
- Add new gear to inventory
- Update or remove owned gear listings
- View provider-specific rental orders
- Update rental order status during fulfillment

### Admin

- View all users on the platform
- Update user status
- Create, update, and delete categories
- View all rental orders

## Database Schema

| Table | Primary Fields | Notes |
| --- | --- | --- |
| Users | id, name, email, password, phone, address, profileImage, role, status | Stores authentication and profile data |
| Categories | id, name, description | Stores gear categories |
| GearItems | id, name, brand, description, specifications, dailyRentalPrice, stock, availableStock, image, isAvailable, providerId, categoryId | Stores gear listings and inventory data |
| RentalOrders | id, customerId, providerId, gearItemId, quantity, startDate, endDate, totalAmount, status | Stores rental lifecycle data |
| Payments | id, rentalOrderId, transactionId, amount, method, provider, status, paidAt | Stores payment transactions |
| Reviews | id, customerId, gearItemId, rentalOrderId, rating, comment | Stores customer feedback |

### Relationship Map

| From | To | Relationship |
| --- | --- | --- |
| User | GearItem | One provider can own many gear items |
| User | RentalOrder | One customer can place many rental orders |
| User | RentalOrder | One provider can receive many rental orders |
| User | Review | One customer can write many reviews |
| Category | GearItem | One category can contain many gear items |
| GearItem | RentalOrder | One gear item can appear in many rental orders |
| GearItem | Review | One gear item can have many reviews |
| RentalOrder | Payment | One rental order can have one payment |
| RentalOrder | Review | One rental order can have one review |
| RentalOrder | GearItem | Each rental order belongs to one gear item |
| RentalOrder | User | Each rental order belongs to one customer and one provider |
| Payment | RentalOrder | Each payment belongs to one rental order |
| Review | RentalOrder | Each review belongs to one rental order |
| Review | User | Each review is written by one customer |
| Review | GearItem | Each review belongs to one gear item |

## API Base

The production API is available at:

`https://gearup-backend-omega.vercel.app`

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a new user as a customer or provider |
| POST | `/api/auth/login` | Public | Authenticate a user and return login credentials |

### Users

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/users` | Admin | Get all users in the system |
| GET | `/api/users/me` | Customer, Provider, Admin | Get the authenticated user's profile |
| PATCH | `/api/users/profile` | Customer, Provider, Admin | Update the authenticated user's profile |
| DELETE | `/api/users/profile` | Customer, Provider | Delete the authenticated user's account |
| PATCH | `/api/users/:id` | Admin | Update a user's status |

### Categories

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/categories` | Public | Get all gear categories |
| POST | `/api/categories` | Admin | Create a new category |
| PATCH | `/api/categories/:id` | Admin | Update a category |
| DELETE | `/api/categories/:id` | Admin | Delete a category |

### Provider API

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/gears/mygear` | Provider | Get gear items owned by the authenticated provider |
| POST | `/api/gears` | Provider | Create a new gear listing |
| PATCH | `/api/gears/:id` | Provider | Update one of the provider's gear listings |
| DELETE | `/api/gears/:id` | Provider | Delete one of the provider's gear listings |
| GET | `/api/rentals/provider/orders` | Provider | Get all rental orders assigned to the authenticated provider |
| PATCH | `/api/rentals/:id` | Customer, Provider | Update rental status |

### Admin API

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/users` | Admin | Get all users in the system |
| PATCH | `/api/users/:id` | Admin | Update a user's status |
| GET | `/api/categories` | Public | Get all gear categories |
| POST | `/api/categories` | Admin | Create a new category |
| PATCH | `/api/categories/:id` | Admin | Update a category |
| DELETE | `/api/categories/:id` | Admin | Delete a category |
| GET | `/api/rentals` | Admin | Get all rental orders across the platform |

### Gear

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/gears` | Public | Get all gear listings |
| GET | `/api/gears/:id` | Public | Get details for a single gear item |
| GET | `/api/gears/mygear` | Provider | Get gear items owned by the authenticated provider |
| POST | `/api/gears` | Provider | Create a new gear listing |
| PATCH | `/api/gears/:id` | Provider | Update one of the provider's gear listings |
| DELETE | `/api/gears/:id` | Provider | Delete one of the provider's gear listings |

### Rentals

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/rentals` | Customer | Create a new rental order |
| GET | `/api/rentals/myrental` | Customer | Get the authenticated customer's rental orders |
| GET | `/api/rentals/:id` | Customer | Get a single rental order belonging to the authenticated customer |
| PATCH | `/api/rentals/:id` | Customer, Provider | Update rental status |

### Payments

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/payments/checkout` | Customer | Create a Stripe checkout session for a confirmed rental |
| POST | `/api/payments/webhook` | Public webhook | Receive Stripe webhook events and mark payments as completed |
| GET | `/api/payments` | Customer | Get the authenticated customer's payment history |
| GET | `/api/payments/:id` | Customer | Get a single payment record |

### Reviews

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/api/reviews` | Public | Get all reviews |
| GET | `/api/reviews/gear/:gearItemId` | Public | Get reviews for a specific gear item |
| GET | `/api/reviews/:id` | Public | Get a single review |
| POST | `/api/reviews` | Customer | Create a review after completing a rental |
| PATCH | `/api/reviews/:id` | Customer | Update the authenticated customer's review |
| DELETE | `/api/reviews/:id` | Customer | Delete the authenticated customer's review |

## Rental Status Flow

`PLACED` → `CONFIRMED` → `PAID` → `PICKED_UP` → `RETURNED`

`CANCELLED` is supported as an alternate terminal state.

## Environment Variables

Create a `.env` file in the project root with the following values:

```env
PORT=5000
DATABASE_URL=
APP_URL=
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Start the Production Build

```bash
npm start
```

## Project Structure

```text
src/
	app.ts
	server.ts
	config/
	lib/
	middleware/
	modules/
	utils/
prisma/
	schema/
generated/
```

## Notes

- Authentication and protected routes use JWT-based role checks.
- Payments are currently implemented with Stripe checkout and webhook verification.
- The Prisma schema is split across multiple files under `prisma/schema/`.

