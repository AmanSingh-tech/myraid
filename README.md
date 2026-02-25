# Task Management Application

A production-ready, full-stack task management application built with Next.js 14, TypeScript, Prisma ORM, and PostgreSQL. Features JWT authentication, AES encryption, and a modern SaaS-quality UI inspired by Linear and Notion.

## 🚀 Features

### Authentication & Security
- **JWT Authentication** with HTTP-only secure cookies (Edge Runtime compatible)
- **Password Hashing** using bcrypt (10 rounds)
- **AES-256-CBC Encryption** for sensitive task descriptions
- **Protected Routes** via Next.js middleware
- **Input Validation** using Zod schemas
- **SQL Injection Prevention** via Prisma ORM
- **Secure Cookie Configuration** (HttpOnly, SameSite, Secure)

### Task Management
- **CRUD Operations** - Create, Read, Update, Delete tasks
- **Status Management** - TODO, IN_PROGRESS, DONE
- **Pagination** - Configurable page size
- **Filtering** - Filter by task status
- **Search** - Search tasks by title
- **User Isolation** - Users can only access their own tasks
- **Real-time Stats** - Dashboard analytics (Total, Completed, In Progress)

### User Interface
- **Modern SaaS Design** - Premium UI inspired by Linear, Notion, and Vercel
- **Responsive Layout** - Sidebar navigation with mobile support
- **Smooth Animations** - Framer Motion page transitions and interactions
- **Professional Components** - Stats cards, badges, modals, and tables
- **Icon System** - Lucide React icons throughout
- **Empty States** - Beautiful placeholders with illustrations
- **Loading States** - Skeleton loaders for better UX
- **Micro-interactions** - Hover effects, scale animations, smooth transitions

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with jose (Edge Runtime compatible)
- **Encryption**: AES-256-CBC (Node.js crypto)
- **Validation**: Zod
- **Styling**: TailwindCSS 3.4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Utilities**: class-variance-authority, clsx, tailwind-merge

### Project Structure
```
myraid/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts    # User registration
│   │   │   ├── login/route.ts       # User login
│   │   │   ├── logout/route.ts      # User logout
│   │   │   └── me/route.ts          # Get current user
│   │   └── tasks/
│   │       ├── route.ts             # GET all tasks, POST new task
│   │       └── [id]/route.ts        # GET, PATCH, DELETE task by ID
│   ├── dashboard/page.tsx           # Home/Landing page
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
├── components/
│   ├── Sidebar.tsx                  # Navigation sidebar
│   ├── Navbar.tsx                   # Top navigation bar
│   ├── StatsCard.tsx                # Dashboard stats cards
│   ├── Badge.tsx                    # Status badges
│   ├── Modal.tsx                    # Reusable modal component
│   └── TaskTable.tsx                # Task list table/cards
├── lib/
│   ├── prisma.ts                    # Prisma client singleton
│   ├── auth.ts                      # JWT signing & verification (jose)
│   ├── encryption.ts                # AES encryption utilities
│   ├── validation.ts                # Zod schemas
│   ├── errors.ts                    # Error handling utilities
│   └── utils.ts                     # Utility functions (cn)
├── prisma/
│   ├── schema.prisma                # Database schema
│   ├── seed.ts                      # Seed script
│   └── migrations/                  # Database migrationsing utilities
├── prisma/
│   ├── schema.prisma                # Database schema
│   └── seed.ts                      # Seed script
├── middleware.ts                    # Route protection middleware
└── [config files]                   # Next.js, TypeScript, Tailwind configs
```

### Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  createdAt DateTime @default(now())
  tasks     Task[]
}

model Task {
  id          String     @id @default(uuid())
  title       String
  description String     // AES encrypted
  status      TaskStatus @default(TODO)
  createdAt   DateTime   @default(now())
  userId      String
  user        User       @relation(fields: [userId], references: [id])
}

enum TaskStatus {
  Edge Runtime compatible using `jose` library
- Tokens stored in HTTP-only cookies (not accessible via JavaScript)
- 7-day expiration
- Verified on every protected route
- Async/await pattern for middleware compatibility
}
```

### Security Implementation

#### 1. JWT Authentication
- Tokens stored in HTTP-only cookies (not accessible via JavaScript)
- 7-day expiration
- Verified on every protected route

#### 2. Cookie Configuration
```typescript
{
  httpOnly: tlax",          // CSRF protection + navigation supporttacks
  secure: true,             // HTTPS only in production
  sameSite: "strict",       // CSRF protection
  maxAge: 604800,           // 7 days
  path: "/"
}
```

#### 3. AES Encryption
- Algorithm: AES-256-CBC
- Random IV for each encryption
- Task descriptions encrypted before database storage
- Decrypted on retrieval

#### 4. Password Security
- bcrypt with 10 salt rounds
- Passwords never stored in plain text
- Secure comparison during login

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Professional Slate/Indigo theme
- **Typography**: Clean hierarchy with font-semibold headings
- **Spacing**: Consistent gap-6 and p-6 patterns
- **Borders**: Rounded-2xl for modern card-based layouts
- **Shadows**: Soft shadow-sm with hover:shadow-md transitions

### Layout Components
- **Sidebar Navigation** (240px fixed)
  - TaskFlow branding with gradient icon
  - Active route highlighting
  - Lucide icons for visual clarity
  - Persistent logout button at bottom
  
- **Top Navbar**
  - Page title display
  - User avatar with gradient background
  - Responsive email display
  - Clean minimal design

### Interactive Components
- **Stats Cards**: Animated cards showing task analytics with gradient icons
- **Task Table**: 
  - Desktop: Professional table with hover effects
  - Mobile: Card-based layout
  - Skeleton loaders during fetch
  - Empty state with illustration
  
- **Modals**: 
  - Backdrop blur effect
  - Slide-up animation
  - Form validation
  - Loading states
  
- **Badges**: Color-coded status indicators
  - TODO: Gray
  - IN_PROGRESS: Blue
  - DONE: Green

### Animations & Transitions
- Page fade-in on load (Framer Motion)
- Stagger animations for list items
- Hover scale effects on buttons (scale-[1.02])
- Smooth color transitions (transition-all)
- Modal slide-up entrance
- Loading spinner animations

### Responsive Design
- Desktop: Sidebar + main content layout
- Tablet: Collapsible sidebar
- Mobile: Full-screen card layouts
- Touch-friendly button sizes (h-12)
- Flexible grid layouts

### Reusable Component Library

All components are fully typed with TypeScript and follow modern React patterns:

**`<Sidebar />`**
- Fixed navigation with branding
- Active route highlighting
- Icon-enhanced menu items
- Logout functionality

**`<Navbar />`**
- Top bar with page title
- User avatar and email display
- Responsive visibility

**`<StatsCard />`**
- Animated entry (Framer Motion)
- Gradient icon backgrounds
- Hover scale effect
- Color variants (indigo, green, slate)

**`<Badge />`**
- Status indicators (TODO, IN_PROGRESS, DONE)
- Automatic color mapping
- Rounded pill design

**`<Modal />`**
- Backdrop blur
- Slide-up animation
- Form wrapper with submit/cancel
- Loading state support
- Click-outside to close

**`<TaskTable />`**
- Responsive (table on desktop, cards on mobile)
- Stagger list animations
- Skeleton loading states
- Empty state component
- Action buttons (edit/delete)

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2026-02-25T00:00:00.000Z"
    }
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2026-02-25T00:00:00.000Z"
    }
  }
}
```

#### Logout
```http
POST /api/auth/logout

Response: 200 OK
{
  "success": true,
  "message": "Logout successful"
}
```

#### Get Current User
```http
GET /api/auth/me

Response: 200 OK
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "createdAt": "2026-02-25T00:00:00.000Z"
    }
  }
}
```

### Task Endpoints

#### Create Task
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management app",
  "status": "TODO"
}

Response: 201 Created
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": "uuid",
      "title": "Complete project",
      "description": "Finish the task management app",
      "status": "TODO",
      "createdAt": "2026-02-25T00:00:00.000Z",
      "userId": "uuid"
    }
  }
}
```

#### Get All Tasks (with Pagination, Filter, Search)
```http
GET /api/tasks?page=1&limit=10&status=TODO&search=project

Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)
  - status: TODO | IN_PROGRESS | DONE (optional)
  - search: string (optional, searches title)

Response: 200 OK
{
  "success": true,
  "data": {
    "tasks": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### Get Single Task
```http
GET /api/tasks/:id

Response: 200 OK
{
  "success": true,
  "data": {
    "task": {
      "id": "uuid",
      "title": "Complete project",
      "description": "Finish the task management app",
      "status": "TODO",
      "createdAt": "2026-02-25T00:00:00.000Z",
      "userId": "uuid"
    }
  }
}
```

#### Update Task
```http
PATCH /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS"
}

Response: 200 OK
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": { ... }
  }
}
```

#### Delete Task
```http
DELETE /api/tasks/:id

Response: 200 OK
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Error Responses

All errors follow this structure:
```json
{
  "success": false,
  "message": "Error description",
  "errorCode": "ERROR_CODE"
}
```

Common error codes:
- `VALIDATION_ERROR` - Invalid input (400)
- `UNAUTHORIZED` - Missing/invalid authentication (401)
- `FORBIDDEN` - Insufficient permissions (403)
- `USER_NOT_FOUND` - User doesn't exist (404)
- `TASK_NOT_FOUND` - Task doesn't exist (404)
- `USER_EXISTS` - Email already registered (409)
- `INTERNAL_ERROR` - Server error (500)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd myraid
```

### 2. Install Dependencies
```bash
npm install
```

This installs:
- Next.js 14 and React 18
- Prisma ORM
- bcrypt for password hashing
- jose for JWT (Edge Runtime compatible)
- Zod for validation
- Framer Motion for animations
- Lucide React for icons
- TailwindCSS and utilities

### 3. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"

# Authentication (use strong random strings in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Encryption (MUST be exactly 32 characters)
AES_SECRET="your-32-character-aes-secret-key"

# Environment
NODE_ENV="development"
```

**Important**: 
- Change all secrets in production
- AES_SECRET must be exactly 32 characters
- Keep .env file secure and never commit it

### 4. Setup Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with demo user
npm run prisma:seed
```

Demo credentials:
- Email: `demo@example.com`
- Password: `demo123`

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

### 6. Build for Production
```bash
npm run build
npm start
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `AES_SECRET`
     - `NODE_ENV=production`
   - Deploy

3. **Setup PostgreSQL**
   - Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - Or external provider: [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app)

4. **Run Migrations**
   ```bash
   # After deployment, run migrations
   npx prisma migrate deploy
   ```

### Railway Deployment (Alternative)

1. **Create Railway Account**
   - Visit [Railway.app](https://railway.app)

2. **Create PostgreSQL Database**
   - Add PostgreSQL service
   - Copy `DATABASE_URL`

3. **Deploy Application**
   - Connect GitHub repository
   - Add environment variables
   - Deploy

4. **Run Migrations**
   ```bash
   railway run npx prisma migrate deploy
   ```

### Environment Variables for Production

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="<generate-strong-random-string>"
AES_SECRET="<exactly-32-character-string>"
NODE_ENV="production"
```

**Generate Secure Secrets:**
```bash
# JWT_SECRET (any length)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# AES_SECRET (exactly 32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

## 🧪 Testing the Application

### Quick Start Testing

1. **Home Page**
   - Visit `http://localhost:3000` or `http://localhost:3001`
   - See landing page with app description
   - Test "Go to Dashboard" button (should redirect to login if not authenticated)

2. **Registration**
   - Click "Register" or go to `/register`
   - Create account with email & password (min 6 characters)
   - Beautiful animated form with gradient button
   - Should redirect to dashboard after success

3. **Login**
   - Go to `/login`
   - Login with credentials
   - Smooth loading animation during authentication
   - Redirects to dashboard with stats

4. **Dashboard Experience**
   - **Stats Cards**: View Total, Completed, and In Progress tasks
   - **Sidebar Navigation**: Easy access to Dashboard, Tasks, Profile, Logout
   - **Search & Filter**: Real-time task filtering by status and title search
   - **Responsive**: Test on mobile - sidebar becomes hidden, table becomes cards

5. **Create Task**
   - Click "+ New Task" button
   - Animated modal slides up
   - Fill form (title, description, status)
   - Task appears with fade-in animation

6. **Manage Tasks**
   - **Edit**: Click pencil icon, modify task in modal
   - **Delete**: Click trash icon, confirm deletion
   - **Status**: View color-coded badges (Gray/Blue/Green)
   - **Pagination**: Navigate through tasks if you have more than 10

7. **Logout**
   - Click "Logout" in sidebar
   - Should clear session and redirect to login

### UI/UX Testing Checklist

- [ ] Smooth animations on page load
- [ ] Hover effects on buttons and cards
- [ ] Loading states (skeleton loaders)
- [ ] Empty state displays when no tasks
- [ ] Mobile responsive layout
- [ ] Modal backdrop blur effect
- [ ] Status badges color-coded correctly
- [ ] Search works in real-time
- [ ] Filter dropdown updates table
- [ ] Pagination controls work
- [ ] Protected routes redirect to login

### API Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt

# Create Task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Test Task","description":"Test Description","status":"TODO"}'

# Get Tasks
curl http://localhost:3000/api/tasks?page=1&limit=10 \
  -b cookies.txt
```

## 📝 Code Quality

### TypeScript
- Strict mode enabled
- Full type coverage
- No `any` types

### Security Best Practices
- ✅ Input validation (Zod)
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection (HTTP-only cookies)
- ✅ CSRF protection (SameSite cookies)
- ✅ Password hashing (bcrypt)
- ✅ Data encryption (AES-256)
- ✅ Environment variables for secrets

### Error Handling
- Centralized error management
- Structured error responses
- Appropriate HTTP status codes
- User-friendly error messages

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL format
postgresql://username:password@host:port/database
```

### Migration Errors
```bash
# Reset database (development only)
npx prisma migrate reset

# Generate client
npx prisma generate
```

### Cookie Issues
- Ensure HTTPS in production
- Check browser security settings
- Verify cookie domain matches deployment URL

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🌟 Key Highlights

### What Makes This App Production-Ready

1. **Security First**
   - Edge Runtime compatible JWT with `jose`
   - HTTP-only cookies prevent XSS
   - AES-256 encryption for sensitive data
   - bcrypt password hashing
   - Input validation with Zod
   - Protected routes via middleware

2. **Modern Tech Stack**
   - Next.js 14 App Router
   - TypeScript strict mode
   - Prisma ORM (type-safe)
   - PostgreSQL database
   - TailwindCSS for styling

3. **Professional UI/UX**
   - SaaS-quality design (Linear/Notion inspired)
   - Framer Motion animations
   - Responsive layout (mobile-first)
   - Loading states and error handling
   - Empty states with illustrations
   - Micro-interactions throughout

4. **Best Practices**
   - RESTful API design
   - Proper error handling
   - Environment variable management
   - Git ignore configuration
   - Clean code architecture
   - Reusable components

5. **Developer Experience**
   - Full TypeScript coverage
   - Clear project structure
   - Comprehensive documentation
   - Easy local setup
   - Vercel/Railway deployment ready

## 👤 Author

Built with ❤️ using Next.js 14, TypeScript, Prisma, and modern web technologies.
