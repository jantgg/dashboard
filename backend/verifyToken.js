const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Acceso denegado');

    try {
        const verified = jwt.verify(token, 'tu_secreto');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Token inválido');
    }
}

module.exports = verifyToken;
