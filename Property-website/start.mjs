import app from './app.mjs';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
   dotenv.config();
}

// Start the server
const PORT = process.env.PORT || '3000';
const server = app.listen(PORT, () => {
    console.log(`Listening to http://127.0.0.1:${PORT}`);
});

// Gracefully shutdown server
process.on('SIGINT', () => {
    console.log('Server shutting down...');
    server.close(() => {
        console.log('Server terminated.');
        process.exit(0);
    });
});