const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'prisma', 'dev.db');
const db = new Database(dbPath);

try {
  db.exec(`
    INSERT INTO User (id, username, password, role, name, createdAt, updatedAt)
    VALUES 
    ('admin-id', 'admin', 'password123', 'ADMIN', 'Admin User', datetime('now'), datetime('now')),
    ('teacher-id', 'teacher', 'password123', 'TEACHER', 'Teacher User', datetime('now'), datetime('now')),
    ('student-id', 'student', 'password123', 'STUDENT', 'Student User', datetime('now'), datetime('now'))
    ON CONFLICT(username) DO NOTHING;
  `);
  console.log("Database seeded successfully!");
} catch (error) {
  console.error("Error seeding database:", error);
}
