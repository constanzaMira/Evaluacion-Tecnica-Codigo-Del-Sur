const express = require('express');
const tokenList = require('../usedTokenList');

const router = express.Router();

router.post('/', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(400).json({ message: 'No authorization header provided' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    tokenList.push(token);
    res.json({ message: 'Logout successful' });
});


module.exports = router;