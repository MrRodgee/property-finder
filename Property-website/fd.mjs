import { registerUser } from './models/user.mjs';
import { createLocation, createProperty } from './models/property.mjs';
import { db } from './config/db.mjs';
import fs from 'fs';

// Generate a random email ensuring uniqueness
function generateRandomEmail(fName, lName, existingEmails) {
    let email = fName.toLowerCase() + '.' + lName.toLowerCase() + (Math.floor(Math.random() * 90) + 10).toString() + '@gmail.com';
    while (existingEmails.has(email)) {
        email = fName + '.' + lName + (Math.floor(Math.random() * 90) + 10).toString() + '@gmail.com';
    }
    existingEmails.add(email);
    return email;
}

// Generate a random phone number ensuring uniqueness
function generateRandomPhone(existingPhones) {
    let phone = '69' + (Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000).toString();
    while (existingPhones.has(phone)) {
        phone = '69' + (Math.floor(Math.random() * (99999999 - 10000000 + 1)) + 10000000).toString();
    }
    existingPhones.add(phone);
    return phone;
}

// Generate a random password
function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}

// Generate users with unique emails and phone numbers
function generateUsers(numUsers) {
    const fNames = ['John', 'Jane', 'Jack', 'Jill', 'James', 'Jenny', 'Jared', 'Jasmine', 'Jasper', 'Jade', 'Giorgos', 'Nektaria',
        'Nikos', 'Maria', 'Kostas', 'Dimitris', 'Eleni', 'Vasilis', 'Vasiliki', 'Vaggelis', 'Kostantinos', 'Anastasis',
        'Anastasia', 'Eirini', 'Eirini', 'Alexandros', 'Alexandra', 'Alex', 'Alexa', 'Alexia', 'Yolanda', 'Takis'];
    const lNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Papachristou', 'Papadopoulos', 'Papadakis', 'Papageorgiou',
        'Papadopoulou', 'Zevgoula', 'Tsampras', 'Tsamprakos', 'Tsamprinos', 'Papoutsas', 'Moustakas', 'Sintoris', 'Avouris',
        'Palaiologos', 'Papadimitriou', 'Satti', 'Ntagkas'];
    
    const existingEmails = new Set();
    const existingPhones = new Set();
    const users = [];

    for (let i = 0; i < numUsers; i++) {

        const fName = fNames[Math.floor(Math.random() * fNames.length)];
        const lName = lNames[Math.floor(Math.random() * lNames.length)];

        const user = {
            username: generateRandomEmail(fName, lName, existingEmails),
            password: generateRandomPassword(10),
            first_name: fName,
            last_name: lName,
            phone: generateRandomPhone(existingPhones)
        };
        users.push(user);
    }

    return users;
}

// Generate locations
function generateLocations(numLocations) {
    const cities = ['Athens', 'Thessaloniki', 'Patra', 'Larisa', 'Heraklion', 'Ioannina', 'Kavala', 'Kalamata', 'Kozani', 'Kilkis', 
        'Korinthos', 'Karditsa', 'Edessa', 'Alexandroupoli', 'Amfissa', 'Argos', 'Arta', 'Grevena', 'Drama'];
    
    const neighborhoods = ['Kolonaki', 'Kifisia', 'Glyfada', 'Nea Smyrni', 'Palaio Faliro', 
        'Marousi', 'Voula', 'Vouliagmeni', 'Vrilissia', 'Pefki', 'Agia Paraskevi', 'Aroi', 'Ampelokipoi',
        'Ano Patissia', 'Ano Glyfada', 'Ano Liosia', 'Maizonos', 'Makrygianni', 'Makrigi', 'Omonia', 
        'Omonoia', 'Agia Varvara', 'Agia Marina', 'Agia Triada', 'Agia Trias', 'Agia Sofia', 'Kanakari', 
        'Tsimiski', 'Toumba', 'Kalamaria', 'Kato Toumba', 'Kato Kalamaria', 'Kato Polemidia', 'Zalokosta', 
        'Zefyri', 'Zografou', 'Zoodochos Pigi', 'Nikitara'];

    const zips = [];
    for (let i = 0; i < neighborhoods.length; i++) {
        zips.push((Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000).toString());
    }

    const locations = new Set();
    for (let i = 0; i < numLocations; i++) {
        let idx = Math.floor(Math.random() * neighborhoods.length);
        let location = {
            country: 'Greece',
            city: cities[Math.floor(Math.random() * cities.length)],
            zip: zips[idx],
            neighborhood: neighborhoods[idx]
        };
        for (let loc of locations) {
            if (loc.city === location.city && loc.zip === location.zip && loc.neighborhood === location.neighborhood) {
                location = null;
                i--;
                break;
            }
        }
        if (location !== null)
            locations.add(location);
    }

    return [...locations];
}

// Generate properties
function generateProperties(numProperties) {
    const types = ["Residential", "Commercial", "Land"];
    const resSubtypes = ['Apartment', 'Studio', 'Maisonette', 'Detached house'];
    const comSubtypes = ['Office', 'Store', 'Warehouse'];
    const properties = [];
    const streets = ['Ermou', 'Stadiou', 'Akadimias', 'Patission', 'Syngrou',
        'Kifisias', 'Vasilissis Sofias', 'Amalias', 'Panepistimiou', 'Peiraios',
        'Leoforos Alexandras', 'Leoforos Vouliagmenis', 'Leoforos Kifisias',
        'Leoforos Syngrou', 'Leoforos Poseidonos', 'Leoforos Vasileos Konstantinou',
        'Leoforos Vasileos Georgiou', 'Leoforos Vasileos Pavlou',
        'Leoforos Vasileos Alexandrou', 'Leoforos El Venizelou', 'Solonos',
        'Themistokleous', 'Ippokratous', 'Sokratous', 'Perikleous', 'Herodotou',
        'Thucydides', 'Platonos', 'Aristotelous', 'Socratous', 'Xenophonos',
        'Epicurou', 'Zinonos', 'Pindarou', 'Aeschylou', 'Sophocleous', 'Euripidou',
        'Demosthenous', 'Isokratous', 'Lysias', 'Andokides', 'Antiphon',
        'Aeschines', 'Lycurgus', 'Dinarchus', 'Hypereides'];
    const numbers = Array.from({length: 300}, (_, i) => i + 1); // Numbers from 1 to 300

    for (let i = 0; i < numProperties; i++) {

        let type = types[Math.floor(Math.random() * types.length)];
        let street = streets[Math.floor(Math.random() * streets.length)];
        let number = numbers[Math.floor(Math.random() * numbers.length)];
        let address = street + ' ' + number.toString();
        let forRent = Math.floor(Math.random() * 2);

        let price = 0;
        if (forRent === 1) {
            price = Math.floor(Math.random() * 76 + 4) * 50;
        } else {
            price = Math.floor(Math.random() * 480 + 2) * 1000;
        }

        let property = {};
        
        if (type === "Residential") {
            property = {
                type: type,
                address: address,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                surface: Math.floor(Math.random() * (1000 - 25 + 1)) + 25,
                price: price,
                constructionYear: Math.floor(Math.random() * 75) + 1950,
                forRent: forRent,
                subtype: resSubtypes[Math.floor(Math.random() * resSubtypes.length)],
                floor: Math.floor(Math.random() * 9),
                levels: Math.floor(Math.random() * 3) + 1,
                bedrooms: Math.floor(Math.random() * 5) + 1,
                bathrooms: Math.floor(Math.random() * 3) + 1
            };

        } else if (type === "Commercial") {
            property = {
                type: type,
                address: address,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                surface: Math.floor(Math.random() * (1000 - 25 + 1)) + 25,
                price: price,
                constructionYear: Math.floor(Math.random() * 75) + 1950,
                forRent: forRent,
                subtype: comSubtypes[Math.floor(Math.random() * comSubtypes.length)],
                floor: Math.floor(Math.random() * 13),
                levels: Math.floor(Math.random() * 5) + 1,
                bathrooms: Math.floor(Math.random() * 6) + 1,
                parking: Math.floor(Math.random() * 2)
            };

        } else if (type === "Land") {
            property = {
                type: type,
                address: address,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                surface: Math.floor(Math.random() * (1000 - 25 + 1)) + 25,
                price: price,
                constructionYear: Math.floor(Math.random() * 75) + 1950,
                forRent: forRent,
                buildable: Math.floor(Math.random() * 2)
            };
        }

        properties.push(property);
    }

    return properties;
}

function fillData() {
    let users = generateUsers(20);
    let locations = generateLocations(50);
    let properties = generateProperties(100);

   
    
        for (let property of properties) {
            createProperty(
                Math.floor(Math.random() * users.length),
                property,
                Math.floor(Math.random() * 50)
            );
        }
    
    console.log('Properties inserted into database');

    

}


fillData();
