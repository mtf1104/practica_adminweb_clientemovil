const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configuración de conexión a tu base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tienda_electronica'
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Rutas API
app.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) res.status(500).send(err);
        res.json(results);
    });
});

app.post('/productos', (req, res) => {
    const { nombre, marca, descripcion, precio, stock } = req.body;
    const query = 'INSERT INTO productos (nombre, marca, descripcion, precio, stock) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nombre, marca, descripcion, precio, stock], (err, result) => {
        if (err) res.status(500).send(err);
        res.json({ id: result.insertId, ...req.body });
    });
});

app.put('/productos/:id', (req, res) => {
    const { nombre, marca, descripcion, precio, stock } = req.body;
    const query = 'UPDATE productos SET nombre=?, marca=?, descripcion=?, precio=?, stock=? WHERE id=?';
    db.query(query, [nombre, marca, descripcion, precio, stock, req.params.id], (err) => {
        if (err) res.status(500).send(err);
        res.json({ message: "Actualizado" });
    });
});

app.delete('/productos/:id', (req, res) => {
    db.query('DELETE FROM productos WHERE id = ?', [req.params.id], (err) => {
        if (err) res.status(500).send(err);
        res.json({ message: "Eliminado" });
    });
});

// Ruta para recibir el carrito de la App y descontar stock
app.post('/pedidos', (req, res) => {
    const { usuario_id, productos } = req.body;

    // 1. Insertamos el registro principal del pedido
    const queryPedido = 'INSERT INTO pedidos (usuario_id, total, estado) VALUES (?, ?, ?)';
    db.query(queryPedido, [usuario_id, 0, 'pagado'], (err, result) => {
        if (err) return res.status(500).send(err);

        const pedidoId = result.insertId;

        // 2. Preparamos los datos para detalle_pedidos
        const queryDetalle = 'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario) VALUES ?';
        const valoresDetalle = productos.map(p => [pedidoId, p.producto_id, p.cantidad, p.precio_unitario]);

        // 3. Insertamos el detalle (esto activará el TRIGGER 'actualizar_stock_venta')
        db.query(queryDetalle, [valoresDetalle], (err) => {
            if (err) return res.status(500).send(err);
            res.json({ message: "Venta registrada con éxito" });
        });
    });
});

app.listen(3000, () => console.log('Servidor en puerto 3000'));