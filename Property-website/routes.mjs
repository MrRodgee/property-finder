import express from 'express';
import { loginUserHandler, logoutUserHandler, checkAuthenticated } from './controllers/userController.mjs';
import { showLoginScreenHandler } from './controllers/userController.mjs';
import { createPropertyHandler, searchPropertiesHandler, showHomePropertiesHandler} from './controllers/propertyController.mjs';
import{ showPropertyPageHandler, showUserPropertiesHandler } from './controllers/propertyController.mjs';
import { toggleFavoriteHandler, showFavoritesHandler,showUserInquiriesHandler ,createInquiryHandler} from './controllers/favoriteInquiryController.mjs';


const router = express.Router();


// Login / Logout
router.get('/login', showLoginScreenHandler);
router.post('/login', loginUserHandler);
router.get('/logout', logoutUserHandler);

// Home Page
router.get('/', showHomePropertiesHandler);
router.get('/home', (req, res) => {res.redirect('/')});

// Search Page
router.post('/search', searchPropertiesHandler);

// Property Page
router.get('/property/:id', showPropertyPageHandler);

// About Us Page
router.get('/about-us', (req, res, next) => {
    try{
        res.render('about-us', { title: 'About Us' });
    } catch (error) {
        next(error);
    }
});

// Contact Page
router.get('/contact', (req, res, next) => {
    try{
        res.render('contact', { title: 'Contact' });
    } catch (error) {
        next(error);
    }
});

// List your property Page
router.get('/list-your-property', checkAuthenticated, (req, res, next) => {
    try{
        res.render('add-property', { title: 'List your property' });
    } catch (error) {
        next(error);
    }
});
router.post('/list-your-property', createPropertyHandler);

// My Listings
router.get('/my-listings', checkAuthenticated,showUserPropertiesHandler);

// Favorites Page
router.get('/favorites', checkAuthenticated, showFavoritesHandler);
router.get('/favorite/:propertyId', checkAuthenticated, toggleFavoriteHandler);

// Inquiry Page
router.post('/inquiry/:propertyId', checkAuthenticated, createInquiryHandler);

// My-inquires page
router.get('/my-inquiries', checkAuthenticated,showUserInquiriesHandler);


export default router;