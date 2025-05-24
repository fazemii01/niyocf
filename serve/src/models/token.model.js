import { model } from "mongoose";

import tokenSchema from "../schemas/token.schema.js";

const Token = model("tokens", tokenSchema);

// Modified to return a Promise directly
async function store({ token, expired_at }) {
  // Removed cb parameter
  try {
    await Token.create({
      token,
      expired_at,
    });
    return { message: "Token added to MongoDB" }; // Return success object
  } catch (err) {
    console.error("Error storing token:", err); // Log error
    throw err; // Re-throw error to be caught by caller
  }
}

async function get(token) {
  try {
    const tokenData = await Token.findOne({ token });
    return tokenData;
  } catch (error) {
    console.log(error);
  }
}

async function destroy(token) {
  try {
    const tokenData = await Token.findOneAndRemove({ token });
    return tokenData;
  } catch (error) {
    console.log(error);
  }
}

export default { store, get, destroy };
