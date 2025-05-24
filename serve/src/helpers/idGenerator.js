/**
 * Generates a random alphanumeric string of a given length.
 * @param {number} length - The desired length of the string.
 * @returns {string} The generated random alphanumeric string.
 */
function generateRandomAlphanumeric(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export { generateRandomAlphanumeric };
