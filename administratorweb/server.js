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

app.listen(3000, () => console.log('Servidor en puerto 3000'));