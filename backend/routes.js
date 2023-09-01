const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const verifyToken = require('./verifyToken');

const router = express.Router();


// ruta protegida
// router.get('/protected', verifyToken, (req, res) => {
//     res.send('Esta es una ruta protegida');
// });

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validación de entrada
    if (!email || !password) {
        return res.status(400).json({ message: 'Por favor, introduzca su correo electrónico y contraseña.' });
    }

    try {
        // Comprueba si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Correo electrónico no registrado.' });
        }

        // Comprueba si la contraseña es correcta
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta.' });
        }

        // Creación de token de autenticación
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Inicio de sesión exitoso', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor' });
    }
});

module.exports = router;

