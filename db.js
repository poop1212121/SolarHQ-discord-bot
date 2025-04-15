import { Low, JSONFile } from "lowdb";

const db = new Low(new JSONFile("db.json"));

// Initialize the database with default values
await db.read();
if (!db.data) {
  db.data = { users: [] }; // Default empty data
  await db.write();
}

export default db;
