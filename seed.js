// seed.js
const mysql = require("mysql2/promise");
require("dotenv").config();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "student_evaluation",
  });

  console.log("✅ Connected to database");

  // Example: create a students table if not exists
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      risk_score FLOAT DEFAULT 0
    )
  `);

  // Example: insert seed data
  await connection.execute(`
    INSERT INTO students (name, email, risk_score)
    VALUES 
      ('Alice', 'alice@example.com', 0.2),
      ('Bob', 'bob@example.com', 0.5)
    ON DUPLICATE KEY UPDATE name=VALUES(name)
  `);

  console.log("🌱 Database seeded successfully!");

  await connection.end();
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
