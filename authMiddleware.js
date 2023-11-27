const jwt = require('jsonwebtoken');
const tokenList = require('./usedTokenList');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token == null) return res.sendStatus(401);
    if (tokenList.includes(token)) return res.sendStatus(403); 

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.userId = user.userId;
        next();
    });
}


module.exports = authenticateToken;