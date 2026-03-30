const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// koneksi database
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'atlet_db',
    password: '734',
    port: 5432,
});

// test route
app.get('/', (req, res) => {
    res.send('API jalan + DB 🚀');
});

app.get('/api/atlet', async (req, res) => {
    const result = await pool.query('SELECT * FROM atlet');
    console.log(result.rows); 
    res.json(result.rows);
});

app.post('/api/atlet', async (req, res) => {
    const { nama, umur, cabang_olahraga } = req.body;

    const result = await pool.query(
        'INSERT INTO atlet (nama, umur, cabang_olahraga) VALUES ($1,$2,$3) RETURNING *',
        [nama, umur, cabang_olahraga]
    );

    res.json(result.rows[0]);
});

app.get('/api/atlet/:id', async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        'SELECT * FROM atlet WHERE id=$1',
        [id]
    );

    res.json(result.rows[0]);
});

app.put('/api/atlet/:id', async (req, res) => {
    const { id } = req.params;
    const { nama, umur, cabang_olahraga } = req.body;

    const result = await pool.query(
        'UPDATE atlet SET nama=$1, umur=$2, cabang_olahraga=$3 WHERE id=$4 RETURNING *',
        [nama, umur, cabang_olahraga, id]
    );

    res.json(result.rows[0]);
});

app.delete('/api/atlet/:id', async (req, res) => {
    const { id } = req.params;

    await pool.query('DELETE FROM atlet WHERE id=$1', [id]);

    res.json({ message: 'Data berhasil dihapus' });
});

app.listen(port, () => {
    console.log(`Server jalan di http://localhost:${port}`);
});