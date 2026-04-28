# ScentStation

A full-stack fragrance discovery app built as a portfolio project to demonstrate authentication, REST API design, and full-stack development with React and Node/Express.

Some fragrance apps are notoriously difficult to use. ScentStation aims to be a cleaner alternative — browse a large perfume dataset, search and filter by notes and accords, and track your personal collection.

## Tech Stack

**Frontend:** React, Vite  
**Backend:** Node.js, Express, Prisma  
**Database:** PostgreSQL (Neon)

## Features

- Browse ~24k perfumes sourced from a Fragrantica/Kaggle dataset
- Search and filter by name, notes, and accords
- Perfume detail pages
- User authentication
- Personal collection tracking — owned and wishlisted perfumes 



### Prerequisites

- Node.js
- A PostgreSQL database (project uses Neon)

## Getting Started

1. Clone the repo
2. Install dependencies in both frontend and backend:
```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Create a `.env` file in `/backend` using `.env.example` as a reference
4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Seed the database:
```bash
node prisma/seed.js
```

6. Start the dev servers:
```bash
# backend
cd backend && npm run dev

# frontend
cd frontend && npm run dev
```

## Project Status

Feature-complete portfolio build. Includes Google OAuth authentication, perfume browsing/filtering, and personal collection tracking (owned + wishlist).

## Author

[hexgrl](https://github.com/hexgrl)