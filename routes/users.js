const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models/db');
const jwt = require('jsonwebtoken');
const tokenList = require('../usedTokenList');

const router = express.Router();





router.post('/register', async (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    console.log(req.body);

    if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    
    try {
        const user = await findUserByEmail(email);
        if (user) {
        return res.status(400).json({ error: 'El usuario ya existe' });
        }
    
        const hash = await bcrypt.hash(password, 10);
        const newUser = await createUser(email, firstName, lastName, hash);
    
        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function createUser(email, firstName, lastName, password) {
    return new Promise((resolve, reject) => {
        db.run(
        'INSERT INTO users (email, firstName, lastName, password) VALUES (?, ?, ?, ?)',
        [email, firstName, lastName, password],
        function (err) {
            if (err) {
            reject(err);
            } else {
            resolve({ id: this.lastID });
            }
        }
        );
    });
}

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }
    
    try {
        const user = await findUserByEmail(email);
        if (!user) {
        return res.status(401).json({ error: 'El usuario no existe' });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        const token = jwt.sign(
            { userId: user.id },  
            process.env.SECRET_KEY,     
            { expiresIn: '1h' }   
        );

        return res.status(200).json({ message: 'Login correcto', token });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});








module.exports = router;
