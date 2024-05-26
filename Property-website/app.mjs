import express from 'express';
import dotenv from 'dotenv';
import exphbs from 'express-handlebars';
import routes from './routes.mjs'
import { connectDB } from './config/db.mjs';
import session from './middleware/sessionMiddleware.mjs';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Create the express appb
const app = express();

// Set the view engine to use the 'handlebars' template engine
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: './views/layouts',
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Database connection
connectDB();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(session);
app.use((req, res, next) => {
    if (req.session) {
        res.locals.userId = req.session.loggedUserId;
        res.locals.user = req.session.user;
     } else {
        res.locals.userId = none;
     }
     next();
});
app.use('/', routes);
app.use((err, req, res, next) => {
    if (res.headersSent) {
       return next(err)
    }
    res.status(500).render('error', { layout: 'empty', title: 'An error has occured' });
});

export default app;
