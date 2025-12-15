# Backend - GroupProp (Lightweight)

## Requirements
- Node.js v18+
- PostgreSQL
- npm

## Setup
1. Copy `.env.example` to `.env` and update DATABASE_URL and JWT_SECRET.
2. Create PostgreSQL database (example):
   ```
   createdb grouppropdb
   ```
3. Install:
   ```
   npm install
   ```
4. Start:
   ```
   npm run dev
   ```

## Notes
- API runs on PORT in .env (default 4000).
- All money amounts are in paise (₹ * 100).
