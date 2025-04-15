const fs = require("fs");
const path = require("path");

const moneyFilePath = path.join(__dirname, "money.json");

// Helper function to read the money file
function readMoneyFile() {
  try {
    const data = fs.readFileSync(moneyFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading money file:", err);
    return {};
  }
}

// Helper function to write to the money file
function writeMoneyFile(data) {
  try {
    fs.writeFileSync(moneyFilePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to money file:", err);
  }
}

// Get user's balance
function getBalance(userId) {
  const data = readMoneyFile();
  return data[userId] ? data[userId].balance : 0;
}

// Add or subtract money from user's balance
function addBalance(userId, amount) {
  const data = readMoneyFile();
  if (!data[userId]) {
    data[userId] = { balance: 0 };
  }
  data[userId].balance += amount;
  writeMoneyFile(data);
}

// Set a specific balance for a user
function setBalance(userId, amount) {
  const data = readMoneyFile();
  if (!data[userId]) {
    data[userId] = { balance: 0 };
  }
  data[userId].balance = amount;
  writeMoneyFile(data);
}

// ✅ Get all user balances
function getAllBalances() {
  return readMoneyFile(); // returns { userId: { balance: num }, ... }
}

// ✅ Get top users by balance
function getTopUsers(limit = 10) {
  const balances = getAllBalances();
  return Object.entries(balances)
    .map(([userId, info]) => ({ userId, balance: info.balance }))
    .sort((a, b) => b.balance - a.balance)
    .slice(0, limit);
}

module.exports = {
  getBalance,
  addBalance,
  setBalance,
  getAllBalances, // ✅ now exported
  getTopUsers, // ✅ now exported
};
