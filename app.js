const express = require('express');
const cors = require('cors'); // Import CORS
const axios = require('axios'); // Import Axios

const app = express();
const PORT = process.env.PORT || 3000; // Use dynamic PORT or fallback to 3000
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyCoU1PW00tGALeMtQrDym6XjB4HTmWWww8'; // Use your provided API key

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for testing (restrict for production)
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Google Places API Route
app.post('/api/google-search', async (req, res) => {
    const { location, cuisine } = req.body;

    try {
        // Query Google Places API
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: `${cuisine} restaurants in ${location}`,
                key: GOOGLE_API_KEY,
            },
        });

        const places = response.data.results.map((place) => ({
            id: place.place_id,
            name: place.name,
            cuisine: cuisine, // Placeholder since Google doesn't return cuisine
            address: place.formatted_address,
            photos: place.photos
                ? place.photos.map(
                    (photo) =>
                        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
                )
                : [],
            ratings: {
                ambience: (place.rating || 0) + 0.5, // Placeholder for ambience
                food: (place.rating || 0) + 0.3, // Placeholder for food
                noise: (place.rating || 0) - 0.2, // Placeholder for noise
                service: (place.rating || 0) + 0.2, // Placeholder for service
                value: (place.rating || 0), // Placeholder for value
            },
        }));

        res.json(places);
    } catch (error) {
        console.error('Failed to fetch data from Google Places API:', error);
        res.status(500).json({ error: 'Failed to fetch data from Google Places API' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

