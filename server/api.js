const express = require('express');
const axios = require('axios');

const router = express.Router();

const API_URL = process.env.API_URL;


router.get('/quiz', async (req, res) => {
    try {
        const response = await axios.get(API_URL);
        res.json(response.data);
    } catch (error) {
         console.error("Error fetching quiz data:", error);
        res.status(500).json({ error: 'Error fetching quiz data from external API' });
    }
});

module.exports = router;