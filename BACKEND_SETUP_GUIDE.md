# Backend Setup Guide - ReWear Platform

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Google OAuth Setup](#google-oauth-setup)
4. [Database Setup](#database-setup)
5. [Serverless Functions Setup](#serverless-functions-setup)
6. [Authentication Flow](#authentication-flow)
7. [API Endpoints](#api-endpoints)
8. [Environment Configuration](#environment-configuration)
9. [Deployment](#deployment)
10. [Testing](#testing)

## Overview

This guide will help you set up a complete backend for the ReWear platform using:

- **Vercel Serverless Functions** for API endpoints
- **PostgreSQL** database for data storage
- **Prisma** as the ORM
- **Google OAuth 2.0** for authentication
- **JWT** for session management

## Prerequisites

### Required Accounts & Services

1. **Google Cloud Console** account
2. **Vercel** account (for deployment)
3. **PostgreSQL** database (Neon, Supabase, or Railway)
4. **GitHub** account (for code repository)

### Required Tools

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **PostgreSQL** client (optional)

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**

   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**

   - Click "Select a project" → "New Project"
   - Name: `rewear-platform`
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
   - Search for "Google Identity" and enable it

### Step 2: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen**

   - Navigate to "APIs & Services" → "OAuth consent screen"
   - Select "External" user type
   - Click "Create"

2. **Fill in App Information**

   ```
   App name: ReWear
   User support email: [your-email@domain.com]
   Developer contact information: [your-email@domain.com]
   ```

3. **Add Scopes**

   - Click "Add or remove scopes"
   - Select these scopes:
     - `email`
     - `profile`
     - `openid`
   - Click "Update"

4. **Add Test Users** (for development)
   - Click "Add users"
   - Add your email address
   - Click "Add"

### Step 3: Create OAuth Credentials

1. **Go to Credentials**

   - Navigate to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"

2. **Configure OAuth Client**

   - Application type: "Web application"
   - Name: "ReWear Web Client"

3. **Add Authorized Origins**

   ```
   http://localhost:3000
   http://localhost:5173
   https://your-vercel-domain.vercel.app
   ```

4. **Add Authorized Redirect URIs**

   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:5173/api/auth/callback/google
   https://your-vercel-domain.vercel.app/api/auth/callback/google
   ```

5. **Save Credentials**
   - Click "Create"
   - **IMPORTANT**: Copy the Client ID and Client Secret

### Step 4: Get Required Information

You'll need these values for the backend setup:

```
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

## Database Setup

### Option 1: Neon (Recommended)

1. **Create Neon Account**

   - Visit: https://neon.tech/
   - Sign up with GitHub

2. **Create Database**

   - Click "Create Project"
   - Name: `rewear-database`
   - Region: Choose closest to your users
   - Click "Create Project"

3. **Get Connection String**
   - Go to "Connection Details"
   - Copy the connection string
   - Format: `postgresql://user:password@host:port/database`

### Option 2: Supabase

1. **Create Supabase Account**

   - Visit: https://supabase.com/
   - Sign up with GitHub

2. **Create Project**

   - Click "New Project"
   - Name: `rewear-platform`
   - Set database password
   - Choose region
   - Click "Create new project"

3. **Get Connection String**
   - Go to "Settings" → "Database"
   - Copy the connection string

### Option 3: Railway

1. **Create Railway Account**

   - Visit: https://railway.app/
   - Sign up with GitHub

2. **Create PostgreSQL Service**
   - Click "New Project"
   - Select "Provision PostgreSQL"
   - Copy the connection string

## Serverless Functions Setup

### Step 1: Create Backend Directory Structure

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize package.json
npm init -y

# Install dependencies
npm install @prisma/client prisma jsonwebtoken google-auth-library cors
npm install -D @types/node @types/jsonwebtoken @types/cors
```

### Step 2: Create Directory Structure

```
backend/
├── api/
│   ├── auth/
│   │   ├── login.ts
│   │   ├── callback.ts
│   │   └── logout.ts
│   ├── users/
│   │   ├── profile.ts
│   │   └── update.ts
│   └── items/
│       ├── index.ts
│       ├── create.ts
│       └── [id].ts
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── package.json
├── vercel.json
└── .env
```

### Step 3: Initialize Prisma

```bash
# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env file
```

### Step 4: Configure Prisma Schema

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  googleId      String   @unique
  role          Role     @default(USER)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  items         Item[]
  favorites     Favorite[]
  exchanges     Exchange[]

  @@map("users")
}

model Item {
  id          String   @id @default(cuid())
  title       String
  description String?
  category    Category
  size        String?
  condition   Condition
  images      String[]
  price       Float?
  isAvailable Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  favorites   Favorite[]
  exchanges   Exchange[]

  @@map("items")
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  itemId    String
  createdAt DateTime @default(now())

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  item      Item     @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@unique([userId, itemId])
  @@map("favorites")
}

model Exchange {
  id          String        @id @default(cuid())
  status      ExchangeStatus @default(PENDING)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  // Relations
  requesterId String
  requester   User          @relation(fields: [requesterId], references: [id])
  itemId      String
  item        Item          @relation(fields: [itemId], references: [id])

  @@map("exchanges")
}

enum Role {
  USER
  ADMIN
}

enum Category {
  TOPS
  BOTTOMS
  DRESSES
  OUTERWEAR
  SHOES
  ACCESSORIES
  OTHER
}

enum Condition {
  NEW
  LIKE_NEW
  EXCELLENT
  GOOD
  FAIR
  POOR
}

enum ExchangeStatus {
  PENDING
  ACCEPTED
  REJECTED
  COMPLETED
  CANCELLED
}
```

### Step 5: Create Environment Variables

Create `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# App
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

### Step 6: Create Prisma Client

Create `lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Step 7: Create Authentication Utilities

Create `lib/auth.ts`:

```typescript
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "./prisma";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface JWTPayload {
	userId: string;
	email: string;
	role: string;
}

export const verifyGoogleToken = async (idToken: string) => {
	try {
		const ticket = await googleClient.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		return payload;
	} catch (error) {
		throw new Error("Invalid Google token");
	}
};

export const createJWT = (payload: JWTPayload): string => {
	return jwt.sign(payload, process.env.JWT_SECRET!, {
		expiresIn: "7d",
	});
};

export const verifyJWT = (token: string): JWTPayload => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
	} catch (error) {
		throw new Error("Invalid JWT token");
	}
};

export const getUserFromToken = async (token: string) => {
	const payload = verifyJWT(token);
	const user = await prisma.user.findUnique({
		where: { id: payload.userId },
	});
	return user;
};
```

## Authentication Flow

### Step 1: Google Login Endpoint

Create `api/auth/login.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const googleAuthUrl =
		`https://accounts.google.com/o/oauth2/v2/auth?` +
		`client_id=${process.env.GOOGLE_CLIENT_ID}&` +
		`redirect_uri=${process.env.NEXTAUTH_URL}/api/auth/callback/google&` +
		`response_type=code&` +
		`scope=openid email profile&` +
		`access_type=offline&` +
		`prompt=consent`;

	res.redirect(googleAuthUrl);
}
```

### Step 2: Google Callback Endpoint

Create `api/auth/callback.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../../../lib/prisma";
import { createJWT } from "../../../lib/auth";

const googleClient = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	`${process.env.NEXTAUTH_URL}/api/auth/callback/google`
);

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const { code } = req.query;

	if (!code || typeof code !== "string") {
		return res.status(400).json({ error: "Authorization code required" });
	}

	try {
		// Exchange code for tokens
		const { tokens } = await googleClient.getToken(code);

		// Get user info from Google
		const ticket = await googleClient.verifyIdToken({
			idToken: tokens.id_token!,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload()!;

		// Find or create user
		let user = await prisma.user.findUnique({
			where: { googleId: payload.sub! },
		});

		if (!user) {
			user = await prisma.user.create({
				data: {
					googleId: payload.sub!,
					email: payload.email!,
					name: payload.name!,
					image: payload.picture!,
				},
			});
		}

		// Create JWT token
		const token = createJWT({
			userId: user.id,
			email: user.email,
			role: user.role,
		});

		// Redirect to frontend with token
		const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}`;
		res.redirect(redirectUrl);
	} catch (error) {
		console.error("Auth callback error:", error);
		res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
	}
}
```

### Step 3: Logout Endpoint

Create `api/auth/logout.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	// In a real app, you might want to blacklist the token
	res.status(200).json({ message: "Logged out successfully" });
}
```

## API Endpoints

### User Profile Endpoint

Create `api/users/profile.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const token = req.headers.authorization?.replace("Bearer ", "");

		if (!token) {
			return res.status(401).json({ error: "No token provided" });
		}

		const user = await getUserFromToken(token);

		if (!user) {
			return res.status(401).json({ error: "Invalid token" });
		}

		// Get user with items count
		const userWithStats = await prisma.user.findUnique({
			where: { id: user.id },
			include: {
				_count: {
					select: {
						items: true,
						favorites: true,
					},
				},
			},
		});

		res.status(200).json(userWithStats);
	} catch (error) {
		console.error("Profile error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}
```

### Items Endpoint

Create `api/items/index.ts`:

```typescript
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "GET") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		const { page = "1", limit = "12", category, search } = req.query;

		const pageNum = parseInt(page as string);
		const limitNum = parseInt(limit as string);
		const skip = (pageNum - 1) * limitNum;

		const where: any = {
			isAvailable: true,
		};

		if (category) {
			where.category = category;
		}

		if (search) {
			where.OR = [
				{ title: { contains: search as string, mode: "insensitive" } },
				{ description: { contains: search as string, mode: "insensitive" } },
			];
		}

		const [items, total] = await Promise.all([
			prisma.item.findMany({
				where,
				include: {
					user: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
					_count: {
						select: {
							favorites: true,
						},
					},
				},
				orderBy: { createdAt: "desc" },
				skip,
				take: limitNum,
			}),
			prisma.item.count({ where }),
		]);

		res.status(200).json({
			items,
			pagination: {
				page: pageNum,
				limit: limitNum,
				total,
				pages: Math.ceil(total / limitNum),
			},
		});
	} catch (error) {
		console.error("Items error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}
```

## Environment Configuration

### Frontend Environment Variables

Create `.env.local` in your frontend directory:

```env
# Backend API
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Analytics
VITE_GA_TRACKING_ID=your-google-analytics-id
VITE_VERCEL_ANALYTICS_ID=your-vercel-analytics-id
```

### Production Environment Variables

For Vercel deployment, add these environment variables:

```env
# Database
DATABASE_URL=your-production-database-url

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT
JWT_SECRET=your-production-jwt-secret

# App URLs
NEXTAUTH_URL=https://your-domain.vercel.app
FRONTEND_URL=https://your-domain.vercel.app
```

## Deployment

### Step 1: Prepare for Deployment

1. **Update package.json scripts**:

```json
{
	"scripts": {
		"dev": "next dev",
		"build": "next build",
		"start": "next start",
		"db:generate": "prisma generate",
		"db:push": "prisma db push",
		"db:migrate": "prisma migrate deploy"
	}
}
```

2. **Create vercel.json**:

```json
{
	"functions": {
		"api/**/*.ts": {
			"runtime": "nodejs18.x"
		}
	},
	"env": {
		"DATABASE_URL": "@database-url",
		"GOOGLE_CLIENT_ID": "@google-client-id",
		"GOOGLE_CLIENT_SECRET": "@google-client-secret",
		"JWT_SECRET": "@jwt-secret"
	}
}
```

### Step 2: Deploy to Vercel

1. **Push to GitHub**:

```bash
git add .
git commit -m "Add backend with Google auth"
git push origin main
```

2. **Deploy on Vercel**:

   - Go to https://vercel.com/
   - Import your GitHub repository
   - Set environment variables
   - Deploy

3. **Update Google OAuth**:
   - Add your Vercel domain to authorized origins
   - Add callback URL: `https://your-domain.vercel.app/api/auth/callback/google`

### Step 3: Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate deploy
```

## Testing

### Step 1: Test Authentication Flow

1. **Test Google Login**:

   - Visit: `https://your-domain.vercel.app/api/auth/login`
   - Should redirect to Google OAuth

2. **Test Callback**:

   - Complete Google OAuth flow
   - Should redirect to frontend with JWT token

3. **Test Protected Endpoints**:
   - Use JWT token in Authorization header
   - Test `/api/users/profile`

### Step 2: Test API Endpoints

```bash
# Test items endpoint
curl https://your-domain.vercel.app/api/items

# Test with authentication
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-domain.vercel.app/api/users/profile
```

## What You Need to Provide

### Required Information

1. **Google OAuth Credentials**:

   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

2. **Database Connection String**:

   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. **JWT Secret**:

   ```
   JWT_SECRET=your-super-secret-key
   ```

4. **Domain Information**:
   ```
   FRONTEND_URL=https://your-domain.vercel.app
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

### Step-by-Step Actions Required

1. **Set up Google Cloud Project** (30 minutes):

   - Create project
   - Enable APIs
   - Configure OAuth consent screen
   - Create OAuth credentials
   - Copy Client ID and Secret

2. **Set up Database** (15 minutes):

   - Choose provider (Neon/Supabase/Railway)
   - Create database
   - Copy connection string

3. **Generate JWT Secret** (5 minutes):

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

4. **Update Environment Variables** (10 minutes):

   - Add all variables to Vercel
   - Update frontend environment

5. **Test Deployment** (15 minutes):
   - Deploy to Vercel
   - Test authentication flow
   - Verify API endpoints

### Optional Enhancements

1. **Email Verification**:

   - Add email verification flow
   - Use services like SendGrid or Resend

2. **File Upload**:

   - Add image upload functionality
   - Use services like Cloudinary or AWS S3

3. **Real-time Features**:

   - Add WebSocket support
   - Use services like Pusher or Socket.io

4. **Caching**:
   - Add Redis for caching
   - Improve API performance

This setup provides a solid foundation for the ReWear platform with secure authentication, scalable database, and serverless architecture.
