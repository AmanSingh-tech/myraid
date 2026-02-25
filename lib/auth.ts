import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

// Convert secret to Uint8Array for jose
const secret = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  userId: string;
}

/**
 * Signs a JWT token with userId payload
 */
export async function signToken(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
  
  return token;
}

/**
 * Verifies and decodes a JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch (error) {
    console.error("[Auth] Token verification error:", error);
    throw new Error("Invalid or expired token");
  }
}
