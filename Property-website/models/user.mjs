import { db } from '../config/db.mjs';
import bcrypt from 'bcrypt';

// Create the user table
db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        fName TEXT NOT NULL,
        lName TEXT NOT NULL,
        phone INTEGER NOT NULL
    )
`);


// Register a new user
export const registerUser = async (username, password, fName, lName, phone) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.exec('BEGIN TRANSACTION');
        const stmt = db.prepare('INSERT INTO Users (username, password, fName, lName, phone) VALUES (?, ?, ?, ?, ?)');
        const { lastInsertRowid } = stmt.run(username, hashedPassword, fName, lName, phone);
        // stmt.finalize();
        db.exec('COMMIT');
        return lastInsertRowid;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Find a user by username
export const findUserByUsername = (username) => {
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        return stmt.get(username);
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error;
    }
};

// Find a user by ID
export const findUserByID = (userID) => {
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(userID);
    } catch (error) {
        console.error('Error finding user by ID:', error);
        throw error;
    }
};

// Authenticate user
export const authenticateUser = async (username, password) => {
    try {
        const user = findUserByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    } catch (error) {
        console.error('Error authenticating user:', error);
        throw error;
    }
};