import * as crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const SECRET_KEY = process.env.AES_SECRET || "";

if (SECRET_KEY.length !== 32) {
  throw new Error("AES_SECRET must be exactly 32 characters");
}

// Convert secret key to buffer
const KEY = Buffer.from(SECRET_KEY, "utf-8");

/**
 * Encrypts text using AES-256-CBC
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  // Return IV + encrypted data
  return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypts AES-256-CBC encrypted text
 */
export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(":");
  
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted text format");
  }
  
  const iv = Buffer.from(parts[0], "hex");
  const encryptedData = parts[1];
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}
