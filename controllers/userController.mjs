import { findUserByUsername, registerUser, authenticateUser } from '../models/user.mjs';
import dotenv from 'dotenv';

dotenv.config();

// Register a new user
export const loginUserHandler = async (req, res) => {
    try {
        let { formType, username, password, alsoPassword, fName, lName, phone} = req.body;
        phone = parseInt(phone);

        if (formType === 'login') {
            if (!findUserByUsername(username)) {
                return res.json({ success: false, message: 'User does not exist.' });
            } 

            const authenticated = await authenticateUser(username, password);

            if (authenticated) {
                req.session.loggedUserId = findUserByUsername(username).id;
                req.session.user = findUserByUsername(username);
                return res.json({ success: true, message: 'User authenticated.', redirect: req.session.originalUrl || '/' });
            } else {
                return res.json({ success: false, message: 'Invalid email or password.' });
            }
        } else if (formType === 'signup') {
            if (findUserByUsername(username)) {
                return res.json({ success: false, message: 'User already exists.' });
            } 

            if (password !== alsoPassword) {
                return res.json({ success: false, message: 'Passwords do not match.' });
            }

            const userId = await registerUser(username, password, fName, lName, phone);

            if (userId) {
                req.session.loggedUserId = userId;
                res.json({ success: true, message: 'User registered.', redirect: req.session.originalUrl || '/' });
            } else {
                res.json({ success: false, message: 'User registration failed.' });
            }
        }
    } catch (error) {
        next(error);
    }
};

// Logout User
export const logoutUserHandler = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        next(error);
    }
};

// Authenticate User
export const checkAuthenticated = async (req, res, next) => {
    try {
        if (req.session.loggedUserId) {
            console.log("user is authenticated", req.originalUrl);
            next();
        } else {
            if (req.originalUrl === "/login") {
                next();
            } else {
                console.log("not authenticated, redirecting to /login");
                res.redirect('/login');
            }
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};


// Show Login / Signup Page
export const showLoginScreenHandler = (req, res, next) => {
    try{
        res.render('auth/login-signup', { layout: 'empty', title: 'Login / Signup'});
    } catch (error) {
        next(error);
    }
};