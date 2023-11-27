const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const fs = require('fs');
const db = require('../models/db');

router.get('/', async (req, res) => {
    const keyword = req.query.keyword; 
    let url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';

    if (keyword) {
        url += `&query=${encodeURIComponent(keyword)}`; 
    }

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZmJlMTUzMmI1MzEyOTA4NWY1NDViNDIxMzQwZDQwNyIsInN1YiI6IjY1NjM4OTc2ZmI1Mjk5MDBhZWRhMGU2MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QOaMZo_QXo-68Bg_-MlMVBo7u_oAYU-2zWTOKxXnjm4'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        const moviesWithScore = data.results.map(movie => ({
            ...movie,
            suggestionScore: Math.floor(Math.random() * 100) // Agregar suggestionScore
        }));

        moviesWithScore.sort((a, b) => b.suggestionScore - a.suggestionScore); // Ordenar por suggestionScore

        res.json(moviesWithScore);
    } catch (err) {
        console.error('error:', err);
        res.status(500).json({ error: 'Error al obtener películas' });
    }
});

router.post('/add-to-favorites', async (req, res) => {
    const { id, title, release_date, genre_ids, vote_average } = req.body;
    const userId = req.userId;
    const addedAt = new Date().toISOString();

    const checkIfExistsQuery = 'SELECT id FROM favorites WHERE id = ?';
    db.get(checkIfExistsQuery, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error al comprobar la película en la base de datos' });
        }

        if (row) {
            return res.status(400).json({ message: 'La película ya está en favoritos' });
        }

        const insertQuery = 'INSERT INTO favorites (id, title, release_date, genre_ids, vote_average, addedAt, user_id) VALUES (?, ?, ?, ?, ?, ?,?)';
        db.run(insertQuery, [id, title, release_date, JSON.stringify(genre_ids), vote_average, addedAt, userId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al agregar la película a la base de datos' });
            }
            res.json({ message: 'Película agregada a favoritos' });
        });
    });
});

router.get('/favorites', (req, res) => {

    const userId = req.userId;
    const query = 'SELECT * FROM favorites WHERE user_id = ?';

    db.all(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener las películas favoritas' });
        }

        const moviesWithScores = results.map(movie => ({
            ...movie,
            suggestionForTodayScore: Math.floor(Math.random() * 100)
        }));

        moviesWithScores.sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore);

        res.json(moviesWithScores);
        
    });
});




module.exports = router;

