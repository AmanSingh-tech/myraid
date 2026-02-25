# Quick Start Guide

Get the Task Management Application running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] PostgreSQL installed and running
- [ ] Git installed

## 🚀 Fast Setup (Copy & Paste)

### 1. Clone and Install

```bash
# Clone repository (if from git)
git clone <your-repo-url>
cd myraid

# Install dependencies
npm install
```

### 2. Create Environment File

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your database credentials
# Required values:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (any random string)
# - AES_SECRET (exactly 32 characters)
```

**Quick Generate Secrets:**

```bash
# Generate JWT_SECRET
echo "JWT_SECRET=\"$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")\"" >> .env

# Generate AES_SECRET (32 chars)
echo "AES_SECRET=\"$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")\"" >> .env
```

**Set Database URL:**

```bash
# PostgreSQL running locally (default)
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/taskmanager"' >> .env

# Or edit manually:
nano .env  # Linux/Mac
notepad .env  # Windows
```

### 3. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed demo user
npm run prisma:seed
```

**Demo User Credentials:**
- Email: `demo@example.com`
- Password: `demo123`

### 4. Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000** 🎉

---

## 📱 First Steps After Starting

### 1. Test the Landing Page
- Open http://localhost:3000
- You should see the landing page with Login/Register buttons

### 2. Login with Demo Account
- Click "Login"
- Email: `demo@example.com`
- Password: `demo123`
- Should redirect to dashboard

### 3. Create Your First Task
- Click "Create New Task"
- Fill in title and description
- Click "Create Task"
- Task should appear in table

### 4. Test Features
- ✅ Edit a task
- ✅ Change status (TODO → IN_PROGRESS → DONE)
- ✅ Search for tasks
- ✅ Filter by status
- ✅ Delete a task
- ✅ Logout

---

## 🐛 Troubleshooting

### Database Connection Failed

**Error**: `Can't reach database server`

**Solution**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list  # Mac

# Start PostgreSQL if not running
sudo systemctl start postgresql  # Linux
brew services start postgresql  # Mac

# Test connection
psql -U postgres

# Create database manually if needed
createdb taskmanager
```

### Port 3000 Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or use different port
PORT=3001 npm run dev
```

### Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
npx prisma generate
```

### Migration Errors

**Error**: `Migration failed`

**Solution**:
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually delete migrations folder and retry
rm -rf prisma/migrations
npx prisma migrate dev --name init
```

### AES_SECRET Length Error

**Error**: `AES_SECRET must be exactly 32 characters`

**Solution**:
```bash
# Generate exactly 32 character secret
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
# Copy output to .env
```

---

## 🧪 Testing Checklist

After setup, verify everything works:

### Backend Tests

```bash
# Test registration
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' \
  -c cookies.txt

# Test get user
curl http://localhost:3000/api/auth/me -b cookies.txt

# Test create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"title":"Test","description":"Test task","status":"TODO"}'

# Test get tasks
curl http://localhost:3000/api/tasks -b cookies.txt
```

### Frontend Tests

- [ ] Can access landing page
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard loads
- [ ] Can create task
- [ ] Can edit task
- [ ] Can delete task
- [ ] Can filter tasks
- [ ] Can search tasks
- [ ] Pagination works
- [ ] Can logout

---

## 📦 Production Build

### Test Production Build Locally

```bash
# Build application
npm run build

# Start production server
npm start

# Visit http://localhost:3000
```

### Build Checklist

- [ ] No TypeScript errors
- [ ] No build warnings
- [ ] All pages load correctly
- [ ] API routes work
- [ ] Environment variables set
- [ ] Database migrations applied

---

## 🚢 Deploy to Vercel (Fastest)

### One-Click Deploy

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

### Setup Environment Variables

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add these variables:

```
DATABASE_URL = postgresql://...
JWT_SECRET = <generated-secret>
AES_SECRET = <32-character-secret>
NODE_ENV = production
```

### Connect Database

**Option 1: Vercel Postgres**
```bash
# Add Vercel Postgres to project
vercel postgres create
```

**Option 2: External Provider**
- [Neon](https://neon.tech) - Free PostgreSQL
- [Supabase](https://supabase.com) - Free tier available
- [Railway](https://railway.app) - $5/month

### Run Migrations

```bash
# After deployment, run migrations
npx prisma migrate deploy
```

---

## 📚 Next Steps

### Learn More
- Read [README.md](README.md) for full documentation
- Check [API.md](API.md) for API reference
- Review [SECURITY.md](SECURITY.md) for security details

### Customize the App
- Modify UI in `app/` directory
- Add new API routes in `app/api/`
- Extend database schema in `prisma/schema.prisma`
- Add utilities in `lib/` directory

### Add Features
- Email verification
- Password reset
- Task categories/tags
- Task priorities
- Due dates
- File attachments
- Team collaboration
- Real-time updates (WebSockets)

---

## 🆘 Get Help

### Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm start               # Start production server

# Prisma
npx prisma generate     # Generate Prisma Client
npx prisma migrate dev  # Create and apply migration
npx prisma migrate deploy  # Apply migrations (production)
npx prisma studio       # Open Prisma Studio (DB GUI)
npm run prisma:seed     # Seed database

# Utilities
npm run lint            # Run ESLint
npm audit              # Check for vulnerabilities
```

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

### Check Your Setup

```bash
# Verify installations
node --version    # Should be 18+
npm --version     # Should be 9+
psql --version    # Should show PostgreSQL version

# Check if server is running
curl http://localhost:3000

# Check if database is connected
npx prisma db pull
```

---

## ✅ Success Checklist

You're ready when:
- [x] Server starts without errors
- [x] Can access http://localhost:3000
- [x] Can login with demo account
- [x] Can create/edit/delete tasks
- [x] Database is working correctly
- [x] No console errors

**Congratulations! You're all set! 🎉**

---

**Need Help?** Check the main [README.md](README.md) for detailed documentation.
