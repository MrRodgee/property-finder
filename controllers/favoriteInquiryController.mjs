import { createFavorite, deleteFavorite, getFavoritesByUser, isFavorite } from '../models/favorites.mjs';
import { createInquiry, getInquiriesForUser } from '../models/inquiry.mjs';
import { getPropertyFromID } from '../models/property.mjs';
import { findUserByID } from '../models/user.mjs';


// Add a favorite
export const toggleFavoriteHandler = (req, res) => {
    try {
        const propertyId = req.params.propertyId;
        const userId = req.session.loggedUserId;

        if (isFavorite(userId, propertyId)) {
            deleteFavorite(userId, propertyId);
        } else {
            createFavorite(userId, propertyId);
        }
        
        res.redirect(`/property/${propertyId}`);
    } catch (error) {
        console.error('Error adding favorite:', error);
        next(error)
    }
};

// Show favorites
export const showFavoritesHandler = (req, res) => {
    try {
        const userId = req.session.loggedUserId;
        const favorites = getFavoritesByUser(userId);

        res.render('my-favorites', { title: 'Favorites', favorites: favorites, numOfFavorites: favorites.length, oneFavorite: favorites.length === 1});
    } catch (error) {
        console.error('Error showing favorites:', error);
        next(error)
    }
}

// Create a new inquiry
export const createInquiryHandler = (req, res) => {
    try {
        const message = req.body.message;
        const propertyId = parseInt(req.params.propertyId);
        const fromId = req.session.loggedUserId;

        const inquiryId = createInquiry({ fromId, propertyId, message });
        res.redirect(`/property/${propertyId}`);
        // res.json({ success: true, message: 'Inquiry created.', inquiryId });
    } catch (error) {
        console.error('Error creating inquiry:', error);
        next(error)
    }
};


export const showUserInquiriesHandler = (req, res) => {
    const userId = req.session.loggedUserId;
    
    try {
        
        let inquiries = getInquiriesForUser(userId);
        let senders = inquiries.map(inquiry => findUserByID(inquiry.fromId))
        let properties = inquiries.map(inquiry => getPropertyFromID(inquiry.propertyId));
        let extendedInquiries = inquiries.map((item, index) => {
            return {...item, ...senders[index],...properties[index]};
        });
        res.render('my-inquiries', { title: 'My Inquiries', inquiries: extendedInquiries, numOfInquiries:extendedInquiries.length, oneInquiry: extendedInquiries.length === 1});

    } catch (error) {
        console.error('Error loading my inquiries page:', error);
        next(error)
    }

}

