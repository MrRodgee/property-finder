import session from 'express-session'
import dotenv from 'dotenv/config'

let appSession = session({
    secret: process.env.SESSION_SECRET,
    cookie: {maxAge: parseInt(process.env.SESSION_LIFETIME), sameSite: true},
    resave: false,
    saveUninitialized: false
});

export default appSession;
