import { db } from '../config/db.mjs';
import { getPropertyFromID } from './property.mjs';

// Create tables
// Favorites
db.exec(`
    CREATE TABLE IF NOT EXISTS Favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        propertyId INTEGER NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users (id),
        FOREIGN KEY (propertyId) REFERENCES Properties (id)
    )
`);

// Create a new favorite
export const createFavorite = (userId, propertyId) => {
    try {
        const stmt = db.prepare('INSERT INTO Favorites (userId, propertyId) VALUES (?, ?)');
        const { lastInsertRowid } = stmt.run(userId, propertyId);
        return lastInsertRowid;
    } catch (error) {
        console.error('Error creating favorite:', error);
        throw error;
    }
};

// Delete a favorite
export const deleteFavorite = (userId, propertyId) => {
    try {
        const stmt = db.prepare('DELETE FROM Favorites WHERE userId = ? AND propertyId = ?');
        stmt.run(userId, propertyId);
    } catch (error) {
        console.error('Error deleting favorite:', error);
        throw error;
    }
};

// Check if a property is a favorite
export const isFavorite = (userId, propertyId) => {
    try {
        const stmt = db.prepare('SELECT * FROM Favorites WHERE userId = ? AND propertyId = ?');
        return !!stmt.get(userId, propertyId);
    } catch (error) {
        console.error('Error checking favorite:', error);
        throw error;
    }
};

// Get all favorites for a user
export const getFavoritesByUser = (userId) => {
    try {
        const stmt = db.prepare('SELECT * FROM Favorites WHERE userId = ?');
        let favorites = stmt.all(userId);
        return favorites.map(favorite => getPropertyFromID(favorite.propertyId));
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
    }
};