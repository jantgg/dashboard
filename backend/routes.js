const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Tarea = require('./models/Tarea');
const Producto = require('./models/Producto');
const Cliente = require('./models/Cliente');
const Proveedor = require('./models/Proveedor');
const verifyToken = require('./verifyToken');
const router = express.Router();


// ruta protegida
// router.get('/protected', verifyToken, (req, res) => {
//     res.send('Esta es una ruta protegida');
// });

// Login de usuario -----------------------------------------------------------------------------------------------------
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

// Crear una nueva tarea--------------------------------------------------------------------------------------------------------------
router.post('/tarea', verifyToken, async (req, res) => {
    try {
        const nuevaTarea = new Tarea({
            ...req.body,
            usuario: req.userId // asumiendo que el ID del usuario decodificado se almacena en req.userId
        });
        await nuevaTarea.save();
        res.status(201).json({ message: 'Tarea creada con éxito', tarea: nuevaTarea });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al crear la tarea' });
    }
});

// Obtener todas las tareas del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get('/tarea', verifyToken, async (req, res) => {
    try {
        const tareas = await Tarea.find({ usuario: req.userId });
        res.status(200).json(tareas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al obtener las tareas' });
    }
});

// Actualizar una tarea (deberías verificar si la tarea pertenece al usuario autenticado)--------------------------------------------------------------------------------------------------------------
router.put('/tarea/:id', verifyToken, async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        if (tarea.usuario.toString() !== req.userId) {
            return res.status(403).json({ message: 'No tienes permiso para modificar esta tarea' });
        }

        tarea.completada = req.body.completada; 
        await tarea.save();
        
        res.status(200).json({ message: 'Tarea actualizada con éxito', tarea });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al actualizar la tarea' });
    }
});


// Eliminar una tarea --------------------------------------------------------------------------------------------------------------
router.delete('/tarea/:id', verifyToken, async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        if (tarea.usuario.toString() !== req.userId) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar esta tarea' });
        }

        await Tarea.findByIdAndRemove(req.params.id);
        res.status(200).json({ message: 'Tarea eliminada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al eliminar la tarea' });
    }
});
// Obtener todas las productos del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get('/product', verifyToken, async (req, res) => {
    try {
        const producto = await Producto.find({ usuario: req.userId });
        res.status(200).json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al obtener las productos' });
    }
});
// Crear una nuevo Producto--------------------------------------------------------------------------------------------------------------
router.post('/product', verifyToken, async (req, res) => {
    try {
        const nuevoProducto = new Producto({
            ...req.body,
            usuario: req.userId // asumiendo que el ID del usuario decodificado se almacena en req.userId
        });
        await nuevoProducto.save();
        res.status(201).json({ message: 'Producto creado con éxito', producto: nuevoProducto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al crear el producto' });
    }
});
// Eliminar un producto --------------------------------------------------------------------------------------------------------------
router.delete('/product/:id', verifyToken, async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'producto no encontrada' });
        }

        if (producto.usuario.toString() !== req.userId) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar esta producto' });
        }

        await Producto.findByIdAndRemove(req.params.id);
        res.status(200).json({ message: 'producto eliminada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al eliminar la producto' });
    }
});

// Obtener todas los clientes del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get('/clients', verifyToken, async (req, res) => {
    try {
        const client = await Cliente.find({ usuario: req.userId });
        res.status(200).json(client);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al obtener los clientes' });
    }
});
// Crear una nuevo Cliente--------------------------------------------------------------------------------------------------------------
router.post('/clients', verifyToken, async (req, res) => {
    try {
        const nuevoCliente = new Cliente({
            ...req.body,
            usuario: req.userId // asumiendo que el ID del usuario decodificado se almacena en req.userId
        });
        await nuevoCliente.save();
        res.status(201).json({ message: 'Cliente creado con éxito', Cliente: nuevoCliente });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al crear el Cliente' });
    }
});
// Eliminar un cliente --------------------------------------------------------------------------------------------------------------
router.delete('/clients/:id', verifyToken, async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'cliente no encontrada' });
        }

        if (cliente.usuario.toString() !== req.userId) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar esta cliente' });
        }

        await Cliente.findByIdAndRemove(req.params.id);
        res.status(200).json({ message: 'cliente eliminada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al eliminar la cliente' });
    }
});
// Obtener todas los proveedor  del usuario autenticado--------------------------------------------------------------------------------------------------------------
router.get('/suppliers', verifyToken, async (req, res) => {
    try {
        const proveedor = await Proveedor.find({ usuario: req.userId });
        res.status(200).json(proveedor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al obtener los proveedores' });
    }
});
// Crear una nuevo proveedor --------------------------------------------------------------------------------------------------------------
router.post('/suppliers', verifyToken, async (req, res) => {
    try {
        const nuevoProveedor = new Proveedor({
            ...req.body,
            usuario: req.userId // asumiendo que el ID del usuario decodificado se almacena en req.userId
        });
        await nuevoProveedor.save();
        res.status(201).json({ message: 'Proveedor creado con éxito', Proveedor: nuevoProveedor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al crear el Proveedor' });
    }
});
// Eliminar un proveedor  --------------------------------------------------------------------------------------------------------------
router.delete('/suppliers/:id', verifyToken, async (req, res) => {
    try {
        const proveedor = await Proveedor.findById(req.params.id);
        if (!proveedor) {
            return res.status(404).json({ message: 'proveedor no encontrada' });
        }
        if (proveedor.usuario.toString() !== req.userId) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar esta proveedor' });
        }
        await Proveedor.findByIdAndRemove(req.params.id);
        res.status(200).json({ message: 'proveedor eliminada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error de servidor al eliminar la proveedor' });
    }
});

module.exports = router;

