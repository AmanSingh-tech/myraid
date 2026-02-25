# Security Documentation

This document outlines the security measures implemented in the Task Management Application.

## 🔐 Security Features

### 1. Authentication & Authorization

#### JWT Token Management
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Storage**: HTTP-only cookies (not accessible via JavaScript)
- **Expiration**: 7 days
- **Secret**: Environment variable `JWT_SECRET`
- **Verification**: Every request to protected routes

#### Cookie Security
```typescript
{
  httpOnly: true,        // Prevents XSS attacks
  secure: true,          // HTTPS only (production)
  sameSite: "strict",    // CSRF protection
  maxAge: 604800,        // 7 days in seconds
  path: "/"
}
```

**Protection Against:**
- ✅ XSS (Cross-Site Scripting) - HTTP-only flag
- ✅ CSRF (Cross-Site Request Forgery) - SameSite strict
- ✅ Man-in-the-middle - Secure flag (HTTPS)

### 2. Password Security

#### Hashing Algorithm
- **Library**: bcrypt
- **Salt Rounds**: 10
- **Strategy**: One-way hashing (irreversible)

#### Password Requirements
- Minimum length: 6 characters
- Maximum length: 100 characters
- Validated on both client and server

**Protection Against:**
- ✅ Rainbow table attacks - Salted hashing
- ✅ Brute force - Slow hashing (bcrypt)
- ✅ Password exposure - Never stored in plain text

### 3. Data Encryption

#### AES-256-CBC Encryption
Used for encrypting task descriptions before database storage.

**Configuration:**
- **Algorithm**: AES-256-CBC
- **Key Size**: 256 bits (32 bytes)
- **IV**: Random 16-byte initialization vector per encryption
- **Secret**: Environment variable `AES_SECRET` (exactly 32 characters)

**Implementation:**
```typescript
// Encryption
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
return iv.toString("hex") + ":" + encrypted;

// Decryption
const [ivHex, encryptedData] = encryptedText.split(":");
const iv = Buffer.from(ivHex, "hex");
const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
return decipher.update(encryptedData, "hex", "utf8") + decipher.final("utf8");
```

**Protection Against:**
- ✅ Data exposure at rest
- ✅ Database breaches (encrypted data is useless without key)
- ✅ Replay attacks (random IV per encryption)

### 4. Input Validation

#### Zod Schema Validation
All user inputs are validated using Zod schemas before processing.

**Registration:**
```typescript
{
  email: z.string().email(),
  password: z.string().min(6).max(100)
}
```

**Task Creation:**
```typescript
{
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"])
}
```

**Protection Against:**
- ✅ SQL injection (combined with Prisma)
- ✅ NoSQL injection
- ✅ Buffer overflow
- ✅ Invalid data types

### 5. SQL Injection Prevention

#### Prisma ORM
All database queries use Prisma's parameterized queries.

**Example:**
```typescript
// SAFE - Prisma handles parameterization
await prisma.user.findUnique({
  where: { email: userInput }
});

// UNSAFE - Never used in this app
await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userInput}`;
```

**Protection Against:**
- ✅ SQL injection attacks
- ✅ Malicious query manipulation

### 6. Route Protection

#### Middleware Implementation
Next.js middleware intercepts requests and verifies authentication.

**Protected Routes:**
- `/dashboard` - Requires authentication
- `/tasks` - Requires authentication
- `/api/tasks/*` - Requires authentication

**Flow:**
1. Extract JWT from cookie
2. Verify token signature and expiration
3. Extract userId from payload
4. Add userId to request headers (for API routes)
5. Allow/deny request based on verification

**Protection Against:**
- ✅ Unauthorized access
- ✅ Token tampering
- ✅ Expired token usage

### 7. Error Handling

#### Secure Error Messages
Errors don't expose sensitive information.

**Bad Example:**
```json
{
  "error": "User john@example.com not found in database table 'users'"
}
```

**Good Example (Used):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errorCode": "INVALID_CREDENTIALS"
}
```

**Protection Against:**
- ✅ Information leakage
- ✅ Stack trace exposure
- ✅ Database schema disclosure

### 8. Environment Variables

#### Secure Configuration
All sensitive data stored in environment variables.

**Required Variables:**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="<random-64-char-hex>"
AES_SECRET="<exactly-32-characters>"
NODE_ENV="production"
```

**Best Practices:**
- Never commit `.env` file
- Use different secrets per environment
- Rotate secrets periodically
- Use strong random values

**Generate Secure Secrets:**
```bash
# JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# AES_SECRET (32 chars)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 9. HTTPS & Transport Security

#### Production Requirements
- **HTTPS Only**: Enforced via `secure` cookie flag
- **TLS 1.2+**: Minimum protocol version
- **HSTS**: Recommended (configure at hosting level)

**Vercel/Railway Configuration:**
Both platforms provide HTTPS by default.

### 10. Rate Limiting (Recommended Addition)

While not implemented in the current version, consider adding:

```typescript
// Example with next-rate-limit
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
```

**Protection Against:**
- Brute force attacks
- DDoS attacks
- API abuse

## 🚨 Security Checklist

### Development
- [x] Use environment variables for secrets
- [x] Never commit `.env` file
- [x] Hash passwords with bcrypt
- [x] Validate all user inputs
- [x] Use parameterized queries
- [x] Encrypt sensitive data
- [x] Implement proper error handling
- [x] Use HTTP-only cookies

### Production Deployment
- [x] Enable HTTPS
- [x] Set `NODE_ENV=production`
- [x] Use secure cookie flags
- [x] Generate strong random secrets
- [x] Rotate secrets regularly
- [x] Use secure database credentials
- [x] Enable database SSL
- [x] Review CORS policies
- [ ] Implement rate limiting (recommended)
- [ ] Add request logging (recommended)
- [ ] Setup security headers (recommended)

### Monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Monitor failed login attempts
- [ ] Track API usage patterns
- [ ] Alert on suspicious activity

## 🔍 Security Testing

### Manual Testing

1. **Authentication Bypass**
   - Try accessing `/dashboard` without login → Should redirect
   - Remove cookie and call API → Should return 401

2. **SQL Injection**
   - Try malicious inputs in email/password
   - Example: `' OR '1'='1`
   - Should be safely handled by Prisma

3. **XSS Attacks**
   - Try injecting `<script>alert('XSS')</script>` in task title
   - Should be sanitized by React

4. **CSRF Protection**
   - Try making requests from different origin
   - Should be blocked by SameSite cookie

5. **Encryption Verification**
   - Check database - descriptions should be encrypted
   - Verify IV is different for each encryption

### Automated Testing Tools

```bash
# OWASP ZAP - Security scanner
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000

# npm audit - Check dependencies
npm audit

# Snyk - Vulnerability scanning
npx snyk test
```

## 🛡️ Common Vulnerabilities (OWASP Top 10)

### A01:2021 – Broken Access Control
**Status**: ✅ Mitigated
- JWT authentication
- Middleware route protection
- User isolation (tasks belong to specific users)

### A02:2021 – Cryptographic Failures
**Status**: ✅ Mitigated
- HTTPS enforcement
- Bcrypt password hashing
- AES-256 data encryption
- Secure cookie transmission

### A03:2021 – Injection
**Status**: ✅ Mitigated
- Prisma ORM (parameterized queries)
- Zod input validation
- No raw SQL queries

### A04:2021 – Insecure Design
**Status**: ✅ Mitigated
- Secure architecture from the start
- Defense in depth approach
- Principle of least privilege

### A05:2021 – Security Misconfiguration
**Status**: ✅ Mitigated
- Secure default configurations
- Environment-specific settings
- Error messages don't leak info

### A06:2021 – Vulnerable Components
**Status**: ⚠️ Requires Maintenance
- Regular `npm audit`
- Keep dependencies updated
- Monitor security advisories

### A07:2021 – Authentication Failures
**Status**: ✅ Mitigated
- Strong password requirements
- Secure session management
- Proper logout functionality

### A08:2021 – Software/Data Integrity
**Status**: ✅ Mitigated
- No CDN dependencies
- Verified npm packages
- Locked dependency versions

### A09:2021 – Logging & Monitoring
**Status**: ⚠️ Basic Implementation
- Error logging in place
- Recommend adding Sentry/Datadog
- Should monitor failed logins

### A10:2021 – Server-Side Request Forgery
**Status**: ✅ Not Applicable
- No external URL fetching
- No user-controlled URLs

## 📞 Security Contacts

### Reporting Vulnerabilities
If you discover a security vulnerability:
1. **DO NOT** open a public issue
2. Email: security@yourcompany.com
3. Include detailed description
4. Expected response: 48 hours

### Security Updates
- Check GitHub releases for security patches
- Subscribe to security advisories
- Review changelogs before updating

## 📚 References

- [OWASP Top 10](https://owasp.org/Top10/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

---

**Last Updated**: February 25, 2026
**Version**: 1.0.0
