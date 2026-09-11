# WCS Inventory Invoice

A modern Next.js application concept for a multi-tenant jewellery, gem, and workshop management system designed for Sri Lankan businesses.

## Included in this UI prototype

- Premium dark navy and gold brand design
- Dashboard with sales, profit, and outstanding summary cards
- Quick invoice section with product search and totals
- Inventory overview table with stock and pricing
- Workshop workflow status cards
- Customer balances and sales summary panels
- Multi-tenant SaaS layout aligned with the business requirements

## Tech stack

- Frontend: Next.js + React + Tailwind CSS
- Database concept: MongoDB Atlas
- Hosting: Vercel
- Multi-tenant model: tenantId / companyId across all primary collections
- Growth plan: super admin portal for multiple businesses

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Set the following environment variables in Vercel project settings:

```env
NEXT_PUBLIC_APP_NAME=WCS Inventory Invoice
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/wcs_inventory
NEXTAUTH_SECRET=generate-a-long-random-secret
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
```

4. Choose the default Next.js framework preset.
5. Deploy.

> If MONGODB_URI is not set yet, the app still runs in repository fallback mode for local demos and UI validation.

## Architecture direction

This prototype reflects the business flow described for:

- Sales and invoice operations
- Inventory management and import/export
- Jewellery order workflow
- Workshop management and employee payments
- Certificates, reports, backup, and promotion sharing
- Multi-company SaaS administration

## Backend foundation

The project now includes a structured API layer with seed data and route definitions for:

- health checks
- tenant management
- product catalog access
- invoice retrieval

The intended production architecture is:

- Frontend: Next.js 14 app router
- Database: MongoDB Atlas or a self-hosted MongoDB instance
- Collections: tenants, users, products, invoices, orders, workshop_jobs, certificates, backups
- Data isolation: tenantId / companyId on every primary document
- Authentication: session-based login or role-based JWT flow for admins, buyers, workshop users, and staff
- Exports: CSV/Excel for inventory and sales reporting
- Deployment: Vercel frontend with MongoDB Atlas for persistence

## Environment variables

Create a .env.local file with values like:

```env
NEXT_PUBLIC_APP_NAME=WCS Inventory Invoice
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/wcs_inventory
NEXTAUTH_SECRET=replace-with-your-secret
```

The next stage can add the remaining MongoDB schemas, authentication flow, and production export integrations.
