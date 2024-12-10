const express = require('express');
const cors = require('cors'); // Import CORS

const app = express();
const PORT = process.env.PORT; // Use the dynamic PORT from the environment variable

// Ensure the PORT variable is defined
if (!PORT) {
    console.error("ERROR: PORT is not defined in the environment variables.");
    process.exit(1);
}

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for testing
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));
app.options('*', cors()); // Enable preflight for all routes
app.use(express.json()); // Parse JSON request bodies

// Mock restaurant data
const mockRestaurants = [
    {
        id: 'miku-vancouver',
        name: 'Miku',
        cuisine: 'Japanese, Sushi',
        address: '200 Granville St, Vancouver, BC',
        ratings: {
            ambience: 8.7,
            food: 9.3,
            noise: 7.8,
            service: 9.0,
            value: 8.5
        },
        photos: [
            'https://via.placeholder.com/300x200?text=Japanese+Restaurant+1',
            'https://via.placeholder.com/300x200?text=Japanese+Restaurant+2',
            'https://via.placeholder.com/300x200?text=Japanese+Restaurant+3'
        ]
    },
    {
        id: 'pasta-palace',
        name: 'Pasta Palace',
        cuisine: 'Italian',
        address: '456 Oak St, Vancouver, BC',
        ratings: {
            ambience: 9.1,
            food: 9.4,
            noise: 8.2,
            service: 8.8,
            value: 8.9
        },
        photos: [
            'https://via.placeholder.com/300x200?text=Italian+Restaurant+1',
            'https://via.placeholder.com/300x200?text=Italian+Restaurant+2',
            'https://via.placeholder.com/300x200?text=Italian+Restaurant+3'
        ]
    },
    {
        id: 'dim-sum-house',
        name: 'Dim Sum House',
        cuisine: 'Chinese, Dim Sum',
        address: '789 Robson St, Vancouver, BC',
        ratings: {
            ambience: 8.9,
            food: 9.5,
            noise: 7.5,
            service: 8.5,
            value: 9.0
        },
        photos: [
            'https://via.placeholder.com/300x200?text=Chinese+Restaurant+1',
            'https://via.placeholder.com/300x200?text=Chinese+Restaurant+2',
            'https://via.placeholder.com/300x200?text=Chinese+Restaurant+3'
        ]
    },
    {
        id: 'taco-town',
        name: 'Taco Town',
        cuisine: 'Mexican, Tacos',
        address: '101 Burrard St, Vancouver, BC',
        ratings: {
            ambience: 8.5,
            food: 9.0,
            noise: 8.0,
            service: 8.2,
            value: 8.7
        },
        photos: [
            'https://via.placeholder.com/300x200?text=Mexican+Restaurant+1',
            'https://via.placeholder.com/300x200?text=Mexican+Restaurant+2',
            'https://via.placeholder.com/300x200?text=Mexican+Restaurant+3'
        ]
    },
    {
        id: 'burger-bistro',
        name: 'Burger Bistro',
        cuisine: 'American, Burgers',
        address: '303 Hastings St, Vancouver, BC',
        ratings: {
            ambience: 8.0,
            food: 8.9,
            noise: 8.5,
            service: 8.3,
            value: 8.6
        },
        photos: [
            'https://via.placeholder.com/300x200?text=American+Restaurant+1',
            'https://via.placeholder.com/300x200?text=American+Restaurant+2',
            'https://via.placeholder.com/300x200?text=American+Restaurant+3'
        ]
    },
    {
        id: 'vegan-vibes',
        name: 'Vegan Vibes',
        cuisine: 'Vegan, Healthy',
        address: '600 Cambie St, Vancouver, BC',
        ratings: {
            ambience: 8.8,
            food: 9.2,
            noise: 7.7,
            service: 8.9,
            value: 8.8
        },
        photos: [
            'https://via.placeholder.com/300x200?text=Vegan+Restaurant+1',
            'https://via.placeholder.com/300x200?text=Vegan+Restaurant+2',
            'https://via.placeholder.com/300x200?text=Vegan+Restaurant+3'
        ]
    },
    {
        id: 'steakhouse-grill',
        name: 'Steakhouse Grill',
        cuisine: 'Steak, American',
        address: '123 Broadway St, Vancouver, BC',
        ratings: {
            ambience: 9.3,
            food: 9.7,
            noise: 8.0,
            service: 9.2,
            value: 9.0
        },
        photos: [
            'https://via.placeholder.com/300x200?text=Steakhouse+Restaurant+1',
            'https://via.placeholder.com/300x200?text=Steakhouse+Restaurant+2',
            'https://via.placeholder.com/300x200?text=Steakhouse+Restaurant+3'
        ]
    },
    {
        id: 'spice-haven',
        name: 'Spice Haven',
        cuisine: 'Indian, Curry',
        address: '200 Kingsway, Vancouver, BC',
        ratings: {
            ambience: 8.6,
            food: 9.4,
            noise: 7.9,
            service: 8.7,
            value: 8.9
        },
        photos: [
            'https://via.placeholder.com/300x200?text=Indian+Restaurant+1',
            'https://via.placeholder.com/300x200?text=Indian+Restaurant+2',
            'https://via.placeholder.com/300x200?text=Indian+Restaurant+3'
        ]
    }
];

// Routes
app.post('/api/search', (req, res) => {
    const { location, cuisine } = req.body;

    // Filter mock restaurants based on location and cuisine for demonstration
    const filteredRestaurants = mockRestaurants.filter((restaurant) =>
        (!cuisine || restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())) &&
        (!location || restaurant.address.toLowerCase().includes(location.toLowerCase()))
    );

    res.json(filteredRestaurants.length ? filteredRestaurants : { message: 'No restaurants found matching the criteria.' });
});

app.post('/api/shortlist', (req, res) => {
    res.json({ message: 'Restaurant added to shortlist.' });
});

app.get('/api/shortlist/:user_id', (req, res) => {
    res.json({ shortlist: [] });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
