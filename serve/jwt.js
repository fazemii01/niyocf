const crypto = require("crypto");

const secret = "faizganteng";
const encoded = Buffer.from(secret).toString("base64url"); // Base64 URL-safe encoding

console.log("Generated JWT Secret Key:", encoded);
