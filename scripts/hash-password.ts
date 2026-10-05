// Print an ADMIN_PASSWORD_HASH value:  npx tsx scripts/hash-password.ts '<password>'
import { randomBytes, scryptSync } from "crypto";
const pw = process.argv[2];
if (!pw) throw new Error("usage: hash-password.ts <password>");
const salt = randomBytes(16);
const hash = scryptSync(pw, salt, 64, { N: 16384, r: 8, p: 1 });
console.log(`scrypt:${salt.toString("hex")}:${hash.toString("hex")}`);
