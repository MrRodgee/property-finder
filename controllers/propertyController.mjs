import { createProperty, getPropertiesFromUserID, getPropertiesWithFilters } from '../models/property.mjs';
import { getPropertiesForRent, getPropertiesForSale } from '../models/property.mjs';
import { getPropertyFromID, getLocationFromID} from '../models/property.mjs';
import { findUserByID } from '../models/user.mjs';
import { isFavorite } from '../models/favorites.mjs';

// Create a new property
export const createPropertyHandler = (req, res) => {
    let { property, location } = req.body;

    const userID = req.session.loggedUserId;
    

    property.surface = parseInt(property.surface);
    property.price = parseInt(property.price);
    property.constructionYear = parseInt(property.constructionYear);
    property.forRent = parseInt(property.forRent);

    if (property.floor !== undefined)
        property.floor = parseInt(property.floor);

    if (property.levels !== undefined)
        property.levels = parseInt(property.levels);

    if (property.bedrooms !== undefined)
        property.bedrooms = parseInt(property.bedrooms);

    if (property.bathrooms !== undefined)
        property.bathrooms = parseInt(property.bathrooms);

    if (property.parking !== undefined)
        property.parking = parseInt(property.parking);

    if (property.buildable !== undefined)
        property.buildable = parseInt(property.buildable);

   

    try {
        const propertyId = createProperty(userID, property, location);
        if (propertyId) {
            res.redirect("/my-listings");
        } else {
            throw new Error('Property creation failed.')
        }
    } catch (error) {
        next(error);
    }
};

// Search properties
export const searchPropertiesHandler = (req, res) => {
    try {
        let locationQuery;
        let propertyFilters = {};
        if (req.body.tabs !== undefined) {
            locationQuery = req.body.locationQuery;
            propertyFilters.forRent = parseInt(req.body.tabs);
        } else {
            locationQuery = req.body.locationQuery;
            propertyFilters = req.body.propertyFilters;
        }

        if (propertyFilters !== undefined ) {
            for (let key in propertyFilters) {
                if (propertyFilters[key] === 'null' || propertyFilters[key] === '')
                    propertyFilters[key] = null;
                else if (!isNaN(propertyFilters[key]))
                    propertyFilters[key] = parseInt(propertyFilters[key]);
            }
        }
        
        // Check for invalid filter values
        if (!!propertyFilters.minPrice && !!propertyFilters.maxPrice)
            if (propertyFilters.minPrice > propertyFilters.maxPrice)
                res.status(400).json({ message: 'Minimum price cannot be greater than maximum price' });
        
        if (!!propertyFilters.minSurface && !!propertyFilters.maxSurface)
            if (propertyFilters.minSurface > propertyFilters.maxSurface)
                res.status(400).json({ message: 'Minimum surface cannot be greater than maximum surface' });

        if (!!propertyFilters.minConstructionYear && !!propertyFilters.maxConstructionYear)
            if (propertyFilters.minConstructionYear > propertyFilters.maxConstructionYear)
                res.status(400).json({ message: 'Minimum construction year cannot be greater than maximum construction year' });

        if (!!propertyFilters.minFloor && !!propertyFilters.maxFloor)
            if (propertyFilters.minFloor > propertyFilters.maxFloor)
                res.status(400).json({ message: 'Minimum floor cannot be greater than maximum floor' });

        if (!!propertyFilters.minLevels && !!propertyFilters.maxLevels)
            if (propertyFilters.minLevels > propertyFilters.maxLevels)
                res.status(400).json({ message: 'Minimum levels cannot be greater than maximum levels' });

        if (!!propertyFilters.minBedrooms && !!propertyFilters.maxBedrooms)
            if (propertyFilters.minBedrooms > propertyFilters.maxBedrooms)
                res.status(400).json({ message: 'Minimum bedrooms cannot be greater than maximum bedrooms' });

        if (!!propertyFilters.minBathrooms && !!propertyFilters.maxBathrooms)
            if (propertyFilters.minBathrooms > propertyFilters.maxBathrooms)
                res.status(400).json({ message: 'Minimum bathrooms cannot be greater than maximum bathrooms' });

        const properties = getPropertiesWithFilters(propertyFilters, locationQuery);
        
        res.render('filters', { title: 'Search properties', properties: properties, numOfResults: properties.length});
    } catch (error) {
        console.error('Error fetching properties:', error);
        next(error);
    }
};

// Show home page properties
export const showHomePropertiesHandler = (req, res) => {
    try {
        let propertiesForSale = getPropertiesForSale();
        let propertiesForRent = getPropertiesForRent();
        propertiesForSale = propertiesForSale.map(property => getPropertyFromID(property.id));
        propertiesForRent = propertiesForRent.map(property => getPropertyFromID(property.id));

        res.render('home', {
            title: 'Property Finder',
            catchphrase: "Ακίνητα προς Αγορά",
            propertiesForSale: propertiesForSale,
            propertiesForRent: propertiesForRent
        });
    } catch (error) {
        console.error('Error loading home page:', error);
        next(error);
        }
};

// Show property page
export const showPropertyPageHandler = (req, res) => {
    try {
        const property = getPropertyFromID(parseInt(req.params.id));
        const location = getLocationFromID(property.locationId);
        const user = findUserByID(property.userId);

        let propertyIsFavorite = false;
        if (req.session.loggedUserId !== undefined)
            propertyIsFavorite = isFavorite(req.session.loggedUserId, property.id);

        res.render('property', {
            property: property,
            location: location,
            listedBy: user,
            isFavorite: propertyIsFavorite
        });
    } catch (error) {
        next(error);
    }
  };

export const showUserPropertiesHandler = (req, res) => {
    const userId = req.session.loggedUserId;
    try {
        let properties = getPropertiesFromUserID(userId);
        properties = properties.map(property => getPropertyFromID(property.id));
        res.render('my-listings', { title: 'My Listings', properties: properties, numOfResults: properties.length});
    }
    catch (error) {
        console.error('Error loading my listings page:', error);
        next(error);   
     }
};

