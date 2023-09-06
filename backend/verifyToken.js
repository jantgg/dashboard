const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
            if (err) {
                return res.status(403).json({ message: "Token inválido" });
            } else {
                req.userId = authData.id;
                next(); // proceder al siguiente middleware o al manejador de la ruta.
            }
        });
    } else {
        return res.status(403).json({ message: "Token no proporcionado" });
    }
};

module.exports = verifyToken;
