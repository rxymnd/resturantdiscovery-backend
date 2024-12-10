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

    console.log('Received request with:', { location, cuisine });

    try {
        // Query Google Places API
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: `${cuisine} restaurants in ${location}`,
                key: GOOGLE_API_KEY,
            },
        });

        console.log('Google API raw response:', response.data);

        if (!response.data.results || response.data.results.length === 0) {
            console.log('No results found in Google API response');
            return res.status(404).json({ error: 'No restaurants found' });
        }

        const places = response.data.results.map((place) => {
            let photos = place.photos
                ? place.photos.map(
                    (photo) =>
                        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
                )
                : [];

            // Ensure unique and varied photos
            if (photos.length < 9) {
                const placeholderPhotos = [
                    'https://via.placeholder.com/400x300?text=Photo+1',
                    'https://via.placeholder.com/400x300?text=Photo+2',
                    'https://via.placeholder.com/400x300?text=Photo+3',
                    'https://via.placeholder.com/400x300?text=Photo+4',
                    'https://via.placeholder.com/400x300?text=Photo+5',
                    'https://via.placeholder.com/400x300?text=Photo+6',
                    'https://via.placeholder.com/400x300?text=Photo+7',
                    'https://via.placeholder.com/400x300?text=Photo+8',
                    'https://via.placeholder.com/400x300?text=Photo+9',
                ];
                // Fill up to 9 photos with placeholders
                photos = [...photos, ...placeholderPhotos.slice(0, 9 - photos.length)];
            }

            return {
                id: place.place_id,
                name: place.name,
                cuisine: cuisine || 'Not specified', // Placeholder since Google doesn't return cuisine
                address: place.formatted_address,
                photos: photos, // Final array of 9 unique photos
                ratings: {
                    ambience: (place.rating || 0) + 0.5, // Placeholder for ambience
                    food: (place.rating || 0) + 0.3, // Placeholder for food
                    noise: (place.rating || 0) - 0.2, // Placeholder for noise
                    service: (place.rating || 0) + 0.2, // Placeholder for service
                    value: (place.rating || 0), // Placeholder for value
                },
            };
        });

        console.log('Formatted places:', places);
        res.json(places);
    } catch (error) {
        console.error('Failed to fetch data from Google Places API:', error.message || error);
        res.status(500).json({ error: 'Failed to fetch data from Google Places API' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
